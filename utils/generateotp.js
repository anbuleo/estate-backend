export const generateOTP = async()=>{
    try {
        return (otp= `${math.floor(1000 + Math.random()*9000)}`)
    } catch (error) {
        console.log(error)
    }
}

