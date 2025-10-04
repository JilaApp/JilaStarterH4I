
export default function SignInBtn({display}: {display: string}) {
    return (
        <button className="bg-jila-400 text-white text-base p-3 w-60 h-12 rounded-lg hover:bg-type-400 cursor-pointer ease-in-out">
            {display}
        </button>
    )
}