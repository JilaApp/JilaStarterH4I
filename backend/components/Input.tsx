import {useState } from "react";

export default function Input() {

    const [input, setInput] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        setInput(formData);
    }

    return (
        <form method="post" onSubmit={handleSubmit}>
            <label>
                <input name="userinput" defaultValue="Enter Email"></input>
                {/* we will use the button component right here */}


            </label>



        </form>
        

    );

}

