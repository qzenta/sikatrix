# 90-diagnose-resources.ps1
# READ-ONLY diagnostic for the Sikatrix podcast RSS feed and enclosure.
# Issues only GET and HEAD requests (curl.exe) plus nslookup. No secrets, no API keys.
# Writes everything to diagnose-resources.log next to this script; prints nothing.
#
# Run from the repo root:   pwsh -NoProfile -File .\90-diagnose-resources.ps1

$ErrorActionPreference = 'Continue'
$LogPath = Join-Path $PSScriptRoot 'diagnose-resources.log'

# Derived from the repo (app/resources/podcast/feed.xml/route.ts, content/podcast/*.md):
$FeedPath      = '/resources/podcast/feed.xml'
$EnclosurePath = '/podcast/vat-thresholds-2026-what-changed.m4a'   # audioFile in episode frontmatter
$Hosts   = @('sikatrix.com', 'www.sikatrix.com')
$Schemes = @('http', 'https')
$Agents  = [ordered]@{
    'browser'   = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    'Googlebot' = 'Googlebot'
}
# Response headers worth keeping (status line, redirects, type/size, range support, server, vercel)
$KeepPattern = '^(HTTP/|location:|content-type:|content-length:|content-range:|accept-ranges:|server:|x-vercel-|cache-control:|age:|via:|retry-after:|strict-transport-security:)'

Set-Content -Path $LogPath -Value '' -Encoding utf8

function Log([string]$Text) {
    Add-Content -Path $LogPath -Value $Text -Encoding utf8
}

function Invoke-Probe {
    param([string]$Label, [string]$Method, [string]$Url, [string]$Agent, [bool]$RangeOnly = $false)

    Log ''
    Log "### $Label | $Method $Url"
    $curlArgs = @('-sS', '-L', '--max-redirs', '10', '--max-time', '60', '-A', $Agent)
    if ($Method -eq 'HEAD') {
        $curlArgs += @('-I')
    } else {
        # GET: discard body; for the large audio file ask for the first KB only
        $curlArgs += @('-o', 'NUL', '-D', '-')
        if ($RangeOnly) { $curlArgs += @('-r', '0-1023') }
    }
    $curlArgs += @('-w', "`n[final_url=%{url_effective} http_code=%{http_code} redirects=%{num_redirects} content_type=%{content_type} size_download=%{size_download} remote_ip=%{remote_ip} time_total=%{time_total}]`n", $Url)

    try {
        $raw = & curl.exe @curlArgs 2>&1 | Out-String
        $lines = $raw -split "`r?`n" | Where-Object {
            $_ -match $KeepPattern -or $_ -match '^\[final_url=' -or $_ -match '^curl:'
        }
        foreach ($l in $lines) { Log "  $l" }
        if (-not $lines) { Log '  (no output)' }
        Log "  curl_exit=$LASTEXITCODE"
    } catch {
        Log "  ERROR: $($_.Exception.Message)"
    }
}

Log "diagnose-resources.log"
Log "generated (local): $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')"
Log "curl: $((& curl.exe --version 2>&1 | Select-Object -First 1))"
Log "feed path: $FeedPath"
Log "enclosure path: $EnclosurePath"

# ---------------------------------------------------------------- HTTP matrix
foreach ($target in @(
        @{ Name = 'FEED';      Path = $FeedPath;      Range = $false },
        @{ Name = 'ENCLOSURE'; Path = $EnclosurePath; Range = $true })) {
    foreach ($h in $Hosts) {
        foreach ($s in $Schemes) {
            foreach ($a in $Agents.Keys) {
                $url = "${s}://${h}$($target.Path)"
                foreach ($m in @('HEAD', 'GET')) {
                    Invoke-Probe -Label "$($target.Name) ua=$a" -Method $m -Url $url -Agent $Agents[$a] -RangeOnly $target.Range
                }
            }
        }
    }
}

# ---------------------------------------------------------------- feed body (live copy, to compare with repo)
Log ''
Log '### FEED BODY (GET https://www.sikatrix.com feed, browser UA)'
try {
    $body = & curl.exe -sS -L --max-time 60 -A $Agents['browser'] "https://www.$($Hosts[0])$FeedPath" 2>&1 | Out-String
    Log $body
} catch {
    Log "  ERROR: $($_.Exception.Message)"
}

# ---------------------------------------------------------------- robots.txt (GET)
Log ''
Log '### ROBOTS (GET https://www.sikatrix.com/robots.txt, Googlebot UA)'
try {
    Log (& curl.exe -sS -L --max-time 60 -A $Agents['Googlebot'] 'https://www.sikatrix.com/robots.txt' 2>&1 | Out-String)
} catch {
    Log "  ERROR: $($_.Exception.Message)"
}

# ---------------------------------------------------------------- DNS
foreach ($name in $Hosts) {
    foreach ($type in @('A', 'AAAA', 'CNAME', 'MX')) {
        Log ''
        Log "### nslookup -type=$type $name"
        try {
            Log (& nslookup.exe "-type=$type" $name 2>&1 | Out-String)
        } catch {
            Log "  ERROR: $($_.Exception.Message)"
        }
    }
}

Log ''
Log '### DONE'
