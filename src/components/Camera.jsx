import { useEffect, useRef } from "react";
import { clientStore } from "../store/clientStore";


const Camera = (props) => {
    const imgRef = useRef(null)
    const {cameraData} = clientStore()

    useEffect(function(){
        if (cameraData) {
            const imageUrl = `data:image/png;base64,${cameraData}`
            imgRef.current.src = imageUrl;

            // Clean up the object URL when component is unmounted
            return () => {
                URL.revokeObjectURL(imageUrl);
            };
        }
 
    },[cameraData])

    return (
        <div className="w-full h-full ">
            <img  alt="turtlebot camera output" className="w-full h-full object-cover  " ref={imgRef}/>
        </div>
    );
}

export default Camera;