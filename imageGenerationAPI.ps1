$headers = @{
    "X-IMGGEN-KEY" = "c86d07e2-65be-41c5-9fe7-185950a97f7f"
    "Content-Type" = "application/json"
}
$body = @{
    "prompt" = "close up photo of a rabbit"
    "aspect_ratio" = "square"
} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "https://app.imggen.ai/v1/generate-image" -Method Post -Headers $headers -Body $body

$responseContent = $response.Content | ConvertFrom-Json
$imageBase64 = $responseContent.images
$imageBytes = [System.Convert]::FromBase64String($imageBase64)
[System.IO.File]::WriteAllBytes("E:\image1.jpg", $imageBytes)