import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Initial = ({}) => {
    const [roomId, setLocalRoomId] = React.useState("");
    const [err, setErr] = React.useState("");
    const navigate = useNavigate();
    const handleSubmit = (e) => {
      e.preventDefault();
        console.log("submit");
        if (!roomId) {
            setErr("Please enter a room ID");
            return;
        }
        navigate("/join?roomId="+roomId);
    };
    return (
        <div className="flex flex-col justify-between items-center p-4 w-full h-[200px]">
            <h1>Join/Create Room</h1>
            <form
                action=""
                className="flex flex-col justify-center gap-2 max-w-[450px] w-full"
            >
                <input
                    className={"p-3 rounded-lg "+ (err ? "border-red-500 border-2" : "")}
                    value={roomId}
                    onChange={(e) => {
                        setLocalRoomId(e.target.value);
                        setErr("");  
                    }}
                    type="text"
                    name="roomId"
                    id="roomId"
                    placeholder="Enter a room ID"
                />
                {err && <p className="text-left text-red-500">{err}</p>}
                <button onClick={handleSubmit}>Join Room</button>
            </form>
            {/* <Link to="/sender">Sender</Link>
          <br />
          <Link to="/receiver">Receiver</Link> */}
        </div>
    );
};

export default Initial;
