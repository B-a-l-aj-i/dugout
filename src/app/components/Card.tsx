'use Client'
// import ThreadModal from "./ThreadModal";
import UserDetails from "./UserDetails";
// type UserDetails={
//     userInfo:string,
//     channedId:number
// }

function Card({ userInfo, channelId }) {
//   console.log(userInfo.user);

  const parts = userInfo.text.split("•");

  return (
    <div className=" p-6 shadow-lg mx-auto b rounded-lg w-1/2 mb-5 max-sm:w-[100%] hover:scale-105 transition-transform duration-300">
      <div className="flex-row gap-3">
        <UserDetails userId={userInfo.user} timestamp={userInfo.ts} />
      </div>
      <div>
        {parts[0]}
        <br />
        &nbsp;&nbsp;{parts[1]}
      </div>
      {/* <ThreadModal channelId={channelId} timestamp={userInfo.ts} /> */}
    </div>
  );
}

export default Card;
