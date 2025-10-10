interface ButtonProps {
  text: string;
  bg_color: string;
  text_color: string;
  font_size: string;
  padding: string;
  width: string;
  height: string;
  border_radius: string;

  hover_bg_color: string;
  // onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  bg_color,
  text_color,
  font_size,
  padding,
  width,
  height,
  border_radius,
  hover_bg_color,
  // onClick,
}) => {
  return (
    <button
      // onClick={onClick}
      className={`bg-${bg_color} text-${text_color} text-${font_size} p-${padding} w-${width} h-${height} rounded-${border_radius} hover:bg-${hover_bg_color} cursor-pointer ease-in-out`}
    >
      {text}
    </button>
  );
};

export default Button;
