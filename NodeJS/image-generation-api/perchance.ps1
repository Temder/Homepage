# Parameters for the requests
$userKey = "9a219f6681b16c9014044d64b42c465a24f6383296f5c7e16655f8832f2a75f1"
$requestId = [math]::Round((Get-Random), 10).ToString("0.0000000000")
$baseUrl = "https://image-generation.perchance.org/api"

# Function to generate random cache buster
function Get-CacheBuster {
    return [math]::Round((Get-Random), 10).ToString("0.0000000000")
}

# Step 1: Get access code
$adAccessCodeResponse = Invoke-RestMethod -Uri "https://perchance.org/api/getAccessCodeForAdPoweredStuff?__cacheBust=$(Get-CacheBuster)"
$adAccessCode = $adAccessCodeResponse

# Step 2: Check verification status
$verificationStatusUrl = "$baseUrl/checkUserVerificationStatus?userKey=$userKey&__cacheBust=$(Get-CacheBuster)"
$verificationStatus = Invoke-RestMethod -Uri $verificationStatusUrl
$verificationStatus.status

if ($verificationStatus.status -eq "not_verified") {
    $userKey = $adAccessCode
    $verificationStatusUrl = "$baseUrl/checkUserVerificationStatus?userKey=$userKey&__cacheBust=$(Get-CacheBuster)"
    $verificationStatus = Invoke-RestMethod -Uri $verificationStatusUrl
}

# Step 3: Verify user (multiple attempts)
while ("verified", "already_verified" -notcontains $verificationStatus.status -and "success", "already_verified" -notcontains $verifyResponse.status) {
    $verifyUserUrl = "$baseUrl/verifyUser?thread=5&__cacheBust=$(Get-CacheBuster)"
    $verifyResponse = Invoke-RestMethod -Uri $verifyUserUrl
    $verifyResponse
    Start-Sleep -Milliseconds 500
}

# Step 4: Generate image
$params = @{
    prompt = "woman, naked"
    seed = -1
    resolution = "512x768"
    guidanceScale = 7
    negativePrompt = "(worst quality, low quality, blurry:1.3)"
    channel = "pershot"
    subChannel = "public"
    userKey = $userKey
    adAccessCode = $adAccessCode
    requestId = $requestId
    maybeNsfw = "false"
}

$generateUrl = "$baseUrl/generate?" + 
    (($params.GetEnumerator() | ForEach-Object { 
        [System.Web.HttpUtility]::UrlEncode($_.Key) + "=" + [System.Web.HttpUtility]::UrlEncode($_.Value) 
    }) -join "&") + 
    "&__cacheBust=$(Get-CacheBuster)"

$generateResponse = Invoke-RestMethod -Uri $generateUrl
if ($generateResponse.status -eq "invalid_key") {
    Write-Host "Failure when generating image.`n`nURL: $generateUrl`n`nResponse: $generateResponse"
} else {
    Write-Host "Successfully generated image.`n`nURL: $generateUrl`n`nResponse: $generateResponse"
}

# Step 6: Download the generated image
if ($generateResponse.imageId) {
    $imageUrl = "$baseUrl/downloadTemporaryImage?imageId=$($generateResponse.imageId)"
    $outputPath = "generated_image.png"
    Invoke-WebRequest -Uri $imageUrl -OutFile $outputPath
    Write-Host "Image saved as $outputPath"
}