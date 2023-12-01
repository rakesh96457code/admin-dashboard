import React from "react";

interface CardProps {
  name: string;
  email: string;
  role: string;
}

const Card: React.FC<CardProps> = ({ name, email, role }) => {
  return (
    <div className="flex w-full items-center justify-between  px-2 py-3 m-1 ">
    
      <div className=" flex  items-center w-[30%] px-1 mx-1">
        <h2>{name}</h2>
      </div>

      <div className="  flex  items-center w-[50%] px-1 mx-1">
        <h2>{email}</h2>
      </div>

      <div className=" flex  items-center w-[20%] px-1 mx-1">
        <h2>{role}</h2>
      </div>

      
    </div>
  );
};

export default Card;
