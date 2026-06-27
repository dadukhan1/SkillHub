const axios = require("axios");

async function testVdoCipher() {
  const apiKey = "Pi7hkArZ9vqfYnhBEPn2ZtNanD6QLednpDh21ISuRSOF1BZtq0NnTn3DO8ZqFmkz";
  const videoId = "test_video_id_or_random"; 
  try {
    const res = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      { ttl: 300 },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${apiKey}`,
        },
      }
    );
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.log("ERROR:", err.response ? err.response.data : err.message);
  }
}

testVdoCipher();
