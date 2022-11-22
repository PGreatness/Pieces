//import axios from "axios";


const Cloudinary = async state => {
    const formData = new FormData();
    formData.append("file", state);
    formData.append("upload_preset", "pieces416");

    // const res = await axios.post(
    //     "https://api.cloudinary.com/v1_1/pieces416/image/upload",
    //     formData
    // );

    let publicId = '';
    let url = '';

    const res = await fetch("https://api.cloudinary.com/v1_1/pieces416/image/upload", {
        method: "POST",
        body: formData
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            publicId = data.public_id;
            url = data.url;

        })


    // const publicId = res.data.public_id;
    // const url = res.data.url;
    return {
        publicId,
        url
    };
};

export default Cloudinary;