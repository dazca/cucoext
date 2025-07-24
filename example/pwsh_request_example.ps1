$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$session.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
$session.Cookies.Add((New-Object System.Net.Cookie("XSRF-TOKEN", "your-xsrf-token-here", "/", "cuco360.cucorent.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("cuco360_session", "your-session-cookie-here", "/", "cuco360.cucorent.com")))
Invoke-WebRequest -UseBasicParsing -Uri "https://cuco360.cucorent.com/face2face/f2ffilter" `
-Method "POST" `
-WebSession $session `
-Headers @{
"authority"="cuco360.cucorent.com"
  "method"="POST"
  "path"="/face2face/f2ffilter"
  "scheme"="https"
  "accept"="*/*"
  "accept-encoding"="gzip, deflate, br, zstd"
  "accept-language"="en-US,en;q=0.9"
  "origin"="https://cuco360.cucorent.com"
  "priority"="u=1, i"
  "referer"="https://cuco360.cucorent.com/face2face"
  "sec-ch-ua"="`"Not)A;Brand`";v=`"8`", `"Chromium`";v=`"138`", `"Google Chrome`";v=`"138`""
  "sec-ch-ua-mobile"="?0"
  "sec-ch-ua-platform"="`"Windows`""
  "sec-fetch-dest"="empty"
  "sec-fetch-mode"="cors"
  "sec-fetch-site"="same-origin"
  "x-requested-with"="XMLHttpRequest"
} `
-ContentType "application/x-www-form-urlencoded; charset=UTF-8" `
-Body "_token=your-csrf-token-here&cod_cliente=your-client-code&rango=01%2F07%2F2025+00%3A00+-+24%2F07%2F2025+23%3A30&order=nom_empleado&type=empleado&document=pantalla&orientation=v"