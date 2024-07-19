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
        [string]$question = 'Möchten Sie fortfahren?',
        [array]$choices = @('&Ja', '&Nein'),
        [int]$standardChoise = 1
    )
    return $Host.UI.PromptForChoice($title, $question, $choices, $standardChoise)
}

$viServerIp = "192.168.8.50"
$viServerLogin = "Administrator@vsphere.local"
$viServerPassword = "Start123#"
$vmxKey = "displayName"
$vmxValue = "Win10Renamed"
$vmxPathLocal = "C:\Users\Tom\Documents"
$vmxPathServer = "vmstore:Datacenter\Datastore 1"
$currentHardwareVersion = "vmx-17"
$newHardwareVersion = "vmx-19"

if ($global:DefaultVIServers.Count -ne 1) {
    Connect-VIServer -Server $viServerIp -User $viServerLogin -Password $viServerPassword
}
Write-Host "Verbunden mit dem Server $($global:DefaultVIServers.Name) angemeldet als $($global:DefaultVIServers.User)"

$vmNames = (Get-VM | Where-Object { $_.HardwareVersion -eq $currentHardwareVersion }).Name

Write-Host "Folgende VMs werden verändert: $($vmNames -join ", ")"

$vmNames | ForEach-Object {
    $vmName = $_

    $vmHardDisks = Get-HardDisk -VM $vmName
    if ($vmHardDisks.Count -gt 1) {
        if ((Get-Choise -title "Es wurden mehrere Festplatten festgestellt. Die Laufwerkbezeichnungen können im folgenden geändert ungewollt geändert werden.") -eq 1) {
            exit
        }
    }
    
    if ((Get-VM Win10).PowerState -eq 'PoweredOn') {
        if ((Get-Choise -title "Die VM $vmName wird für folgende Aufgaben heruntergefahren") -eq 0) {
            Shutdown-VMGuest -VM $vmName
        } else {
            exit
        }
    }
    
    if ((Get-Choise -title "Der Wert $vmxKey in der VMX Datei wird zu $vmxValue geändert") -eq 0) {
        Copy-DatastoreItem -Item "$vmxPathServer\$vmName\$vmName.vmx" -Destination $vmxPathLocal
        Edit-VmxFile -vmxFilePath "$vmxPathLocal\$vmName.vmx" -key $vmxKey -value $vmxValue
        Copy-DatastoreItem -Item "$vmxPathLocal\$vmName.vmx" -Destination "$vmxPathServer\$vmName\"
    }
    
    if ($currentHardwareVersion -ne $newHardwareVersion) {
        if ((Get-Choise -title "Die Hardware Version wird zu $newHardwareVersion geändert") -eq 0) {
            Set-VM -VM $vmName -HardwareVersion $newHardwareVersion
        }
    }
    
    if ((Get-Choise -title "Alle CD-Laufwerke werden gelöscht") -eq 0) {
        $cdDrives = Get-CDDrive -VM $vmName
        if ($cdDrives) {
            Remove-CDDrive -CD $cdDrives
        } else {
            Write-Host "Es sind keine CD-Laufwerke vorhanden"
        }
    }
    
    if ((Get-Choise -title "Die VM wird gestartet") -eq 0) {
        Start-VM $vmName
    }
}
