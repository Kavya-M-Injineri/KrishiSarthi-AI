analysis = client.responses.create(
    model="gpt-4o-mini",
    input=[{
        "role": "user",
        "content": [
            {"type": "input_text", "text": 
             "Analyze this soil image.\n\n"
             "1. Extract exact soil color:\n"
             "- Return HEX code\n"
             "- Return RGB values\n"
             "- Return a simple color name\n\n"
             "2. Estimate soil pH based on soil color:\n"
             "- Use real soil-color-to-pH correlations\n"
             "- Return estimated pH range (Example: 6.1–6.8)\n"
             "- Add justification\n\n"
             "3. If the image is NOT soil, return EXACTLY: INVALID_INPUT"
             },
            {"type": "input_image", "image_url": image_path}
        ]
    }]
)