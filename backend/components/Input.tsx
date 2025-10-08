import { useState } from "react";
import mailIcon from "../assets/mail.svg";
import lockIcon from "../assets/lock-keyhole.svg"
import eyeIcon from "../assets/eye.svg"
import eyeOffIcon from "../assets/eye-off.svg"
import mailDarkIcon from "../assets/mail-dark.svg"


export default function Input() {

    const [input, setInput] = useState("");

    // function handleSubmit(e) {
    //     e.preventDefault();

    //     const form = e.target;
    //     const formData = new FormData(form);

    //     setInput(formData);
    // }

    return (
        <form method="post">
            <label className="flex flex-col w-[490px] h-[420px] gap-y-[20px] pl-[20px] pr-[20px] pt-[20px] pb-[20px]">
                <label className="flex items-center border-[1px] border-gray-300 rounded-[10px] bg-white text-gray-300 pl-[18px] w-[450px] h-[60px]"> {/*onSubmit={handleSubmit} */}
                    <img className="pr-[8px]" src={mailIcon.src}></img>

                    <input className="link-text text-gray-300 w-[95px]" name="userinput" defaultValue="Enter Email"></input>
                    {/* we will use the button component right here */}
                </label>

                <label className="flex items-center border-[1px] border-gray-300 rounded-[10px] bg-gray-200 text-gray-300 pl-[18px] w-[450px] h-[60px]"> {/*onSubmit={handleSubmit} */}
                    <img className="pr-[8px]" src={mailIcon.src}></img>

                    <input className="link-text text-gray-300 w-[95px]" name="userinput" defaultValue="Enter Email"></input>
                    {/* we will use the button component right here */}
                </label>

                <label className="flex items-center border-[1px] border-gray-300 rounded-[10px] bg-white text-gray-300 pl-[18px] w-[450px] h-[60px]"> {/*onSubmit={handleSubmit} */}
                    <img className="pr-[8px]" src={lockIcon.src}></img>

                    <input className="link-text text-gray-300 w-[346px]" name="userinput" defaultValue="Enter Password"></input>

                    <img className="pl-[12px]" src={eyeOffIcon.src}></img>
                    {/* we will use the button component right here */}
                </label>

                <label className="flex items-center border-[1px] border-gray-300 rounded-[10px] bg-white text-gray-300 pl-[18px] w-[450px] h-[60px]"> {/*onSubmit={handleSubmit} */}
                    <img className="pr-[8px]" src={lockIcon.src}></img>

                    <input className="link-text text-gray-300 w-[346px]" name="userinput" defaultValue="Enter Password"></input>

                    <img className="pl-[12px]" src={eyeIcon.src}></img>
                    {/* we will use the button component right here */}
                </label>

                <label className="flex items-center border-[1px] border-jila-400 rounded-[10px] bg-white text-gray-300 pl-[18px] w-[450px] h-[60px]"> {/*onSubmit={handleSubmit} */}
                    <img className="pr-[8px]" src={mailDarkIcon.src}></img>

                    <input className="link-text text-type-400 w-[178px]" name="userinput" defaultValue="skim660@illinois.edu"></input>
                    {/* we will use the button component right here */}
                </label>


            </label>
        </form>
    );
}

