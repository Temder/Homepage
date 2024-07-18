function Edit-VmxFile {
    param (
        [string]$vmxFilePath,
        [string]$key,
        [string]$value
    )

    if (-Not (Test-Path $vmxFilePath)) {
        Write-Error "The file '$vmxFilePath' does not exist."
        return
    }

    # Read all lines from the vmx file
    $lines = Get-Content -Path $vmxFilePath

    # Initialize a flag to check if the key was found and updated
    $keyFound = $false

    # Loop through each line to find the key and update its value
    for ($i = 0; $i -lt $lines.Length; $i++) {
        if ($lines[$i] -match "^$key\s*=\s*") {
            $lines[$i] = "$key = `"$value`""
            $keyFound = $true
            break
        }
    }

    # If the key was not found, append it to the end of the file
    if (-Not $keyFound) {
        $lines += "$key = `"$value`""
    }

    # Write the updated lines back to the vmx file
    Set-Content -Path $vmxFilePath -Value $lines

    Write-Output "The file '$vmxFilePath' has been updated successfully."
}

# Example usage
# Edit-VmxFile -vmxFilePath "C:\path\to\your\file.vmx" -key "svga.vramSize" -value "16777216"

function Get-Choise {
    param (
        [Parameter(Mandatory)]
        [string]$title,
        [string]$question = 'Do you want to continue?',
        [array]$choices = @('&Yes', '&No'),
        [int]$standardChoise = 1
    )
    return $Host.UI.PromptForChoice($title, $question, $choices, $standardChoise)
}

$viServerIp = 192.168.8.50
$viServerLogin = "Administrator@vsphere.local"
$viServerPassword = "Start123#"
$vmName = "Win10"
$vmxKey = "displayName"
$vmxValue = "Win10Renamed"
$vmxPathLocal = "C:\Users\Tom\Documents"
$vmxPathServer = "vmstore:Datacenter\Datastore 1"
$newHardwareVersion = "vmx-19"

if ($global:DefaultVIServers.Count -ne 1) {
    Connect-VIServer -Server $viServerIp -User $viServerLogin -Password $viServerPassword
}
Write-Host "Connected to server $($global:DefaultVIServers.Name) with port $($global:DefaultVIServers.Port) as user $($global:DefaultVIServers.User)"

if ((Get-VM Win10).PowerState -eq 'PoweredOn') {
    if ((Get-Choise -title "Shutting down the VM $vmName for following tasks") -eq 0) {
        Shutdown-VMGuest -VM $vmName
    } else {
        exit
    }
}
if ((Get-Choise -title "Editing the vmx file value $vmxKey to $vmxValue") -eq 0) {
    Copy-DatastoreItem -Item "$vmxPathServer\$vmName\$vmName.vmx" -Destination $vmxPathLocal
    Edit-VmxFile -vmxFilePath "$vmxPathLocal\$vmName.vmx" -key $vmxKey -value $vmxValue
    Copy-DatastoreItem -Item "$vmxPathLocal\$vmName.vmx" -Destination "$vmxPathServer\$vmName\"
} else {
    Write-Host "`nSkipping vmx file edit"
}

if ((Get-Choise -title "Upgrading the Hardware Version to $newHardwareVersion") -eq 0) {
    Set-VM -VM $vmName -HardwareVersion $newHardwareVersion
} else {
    Write-Host "`nSkipping Hardware Version Upgrade"
}

if ((Get-Choise -title "Deleting all CD-Drive(s)") -eq 0) {
    $cdDrives = Get-CDDrive -VM $vmName
    if ($cdDrives) {
        Remove-CDDrive -CD $cdDrives
    } else {
        Write-Host "There are no CD-Drive(s) to remove"
    }
} else {
    Write-Host "`nSkipping CD-Drive deletion"
}

if ((Get-Choise -title "Starting the VM") -eq 0) {
    Start-VM $vmName
}
