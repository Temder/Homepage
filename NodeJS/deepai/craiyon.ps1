# API endpoint
$apiUrl = "https://api.craiyon.com/v3/generate"

# Request body
$body = @{
    prompt = "sunset, mountains"
    version = "35s5hfwn9n78gb06"  # Required version parameter
    token = $null
    model = "photo"  # Changed to specific model
    negative_prompt = ""
    config = @{  # Added configuration parameters
        runtime = "k"
        scheduler = "KDPMSolverMultistep"
        num_inference_steps = 20
        guidance_scale = 7.5
        seed = -1
    }
} | ConvertTo-Json -Depth 10

# Headers
$headers = @{
    "Content-Type" = "application/json"
    "User-Agent" = "Mozilla/5.0"  # Added user agent
}

try {
    # Make the API call with increased timeout
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -Headers $headers -TimeoutSec 120

    # Process the response
    Write-Host "Generated Images:"
    if ($response.images) {
        foreach ($imageUrl in $response.images) {
            Write-Host "https://img.craiyon.com/$imageUrl"
        }
    } else {
        Write-Host "No images were returned in the response"
    }
}
catch {
    Write-Host "Error Details:"
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails
    }
}