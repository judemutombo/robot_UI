import React, { useEffect, useRef, useState } from 'react';
import ROSLIB from 'roslib';
import ROS2D from 'ros2d';
import createjs from 'easeljs'
import { clientStore } from '../store/clientStore';

const Map = (props) => {
    const {ros, connectedRos}= clientStore()
    const mapref = useRef(null);
    const viewerRef = useRef(null); // Viewer canvas reference
    let viewer = null;
    let gridClient = null;
    let tfListener = null;

    const robotIcon = new createjs.Shape();
    robotIcon.graphics.beginFill('red'); // Set the fill color
    robotIcon.graphics.drawCircle(0, 0, 0.10); 
    robotIcon.graphics.endFill();   
    
    let ro = new ResizeObserver(() => {
        handleResize()
    });

    const gridChange = () => {
        // Automatically scale the map to fit the viewer
        if(gridClient.currentGrid.pose && mapref.current != null){
            const containerWidth = mapref.current.offsetWidth;
            const containerHeight = mapref.current.offsetHeight;
            const mapWidth = gridClient.currentGrid.width;
            const mapHeight = gridClient.currentGrid.height;
            console.log(mapWidth)
            console.log(mapHeight)

            console.log(containerWidth)
            console.log(containerHeight)

            // Calculate scale factor to fit map to container
            const scaleX =  mapWidth //+ (mapWidth - containerWidth);
            const scaleY =  mapHeight //+ (mapHeight - containerHeight);
            const scale = Math.min(scaleX, scaleY);

            // Apply the calculated scale
            viewer.scaleToDimensions(scaleX , scaleY );

            // Center the map
            viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
        }
    };

    const handleResize = () => {
        if (gridClient) {
            gridChange();
        }
    };

    const updatePosition = (message) => {
        message.transforms.forEach((transform) => {
            if (transform.header.frame_id === 'odom') {
                const { translation, rotation } = transform.transform;
                // Update robot icon position
                const x = translation.x * 1; // Adjust scaling factor as needed
                const y = -translation.y * 1; // Negate Y-axis for canvas coordinates
                robotIcon.x = x;
                robotIcon.y = y;
    
                // Update robot icon rotation
                const yaw = Math.atan2(
                    2.0 * (rotation.w * rotation.z + rotation.x * rotation.y),
                    1.0 - 2.0 * (rotation.y * rotation.y + rotation.z * rotation.z)
                );
                robotIcon.rotation = (yaw * -180) / Math.PI; // Convert radians to degrees
    
                // Update the stage
                viewer.scene.update();
            }
        });
    }


    useEffect(() => {
        if (connectedRos && mapref.current != null) {
            // Clear previous content
            while (mapref.current.firstChild) {
                mapref.current.removeChild(mapref.current.firstChild);
            }
            // Initialize ROS2D viewer
            viewer = new ROS2D.Viewer({
                divID: 'map', // This ID should match the div for the map container
                width: mapref.current.offsetWidth,
                height: mapref.current.offsetHeight,
            });

            // Create a grid map
            gridClient = new ROS2D.OccupancyGridClient({
                ros: ros,
                rootObject: viewer.scene,
            });


            tfListener = new ROSLIB.Topic({
                ros: ros,
                name: '/tf',
                messageType: 'tf2_msgs/TFMessage'
            });
            
            tfListener.subscribe(updatePosition);

            gridClient.on('change', gridChange);

            viewerRef.current = viewer;
            viewer.scene.addChild(robotIcon);
            // Add resize event listener
            
            ro.observe(mapref.current)

            return () => {
                //mapref.current.addEventListener('resize', handleResize);
            };
        }
    }, [connectedRos, mapref.current]);



    return (
        <div id='map' className='w-full h-full  overflow-hidden' ref={mapref} onResize={handleResize}>
        </div>
    );
};

export default Map;
