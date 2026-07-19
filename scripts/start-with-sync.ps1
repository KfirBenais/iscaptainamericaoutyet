$localRoot = "C:\Users\kfir\Repos\iscaptainamericaoutyet"
$zRoot = "Z:\Kfir\Repos\iscaptainamericaoutyet"

if (Test-Path "Z:\") {
    Write-Host "Backing up to Z: ..."
    robocopy $localRoot $zRoot /MIR /XD node_modules build /NFL /NDL /NJH /NJS /R:2 /W:2 | Out-Null
    Write-Host "Backup to Z: done."
} else {
    Write-Host "Z: drive not available, skipping backup."
}

npx react-scripts start
