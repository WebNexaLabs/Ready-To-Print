
async function testPincode() {
    try {
        const response = await fetch('https://api.postalpincode.in/pincode/722203');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testPincode();
