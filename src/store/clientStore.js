import {create} from 'zustand';
import io from 'socket.io-client';
import ROSLIB from 'roslib';

export const clientStore = create((set,get) => ({
    connectedSocket : false,
    connectedRos : false,
    menu : "Dashboard",
    menuOpened : false,
    socket : null,
    ros : null,
    cameraData : null,
    speed : 0,
    setmenu : (menu) => set({menu}),
    setmenuOpened : (menuOpened) => set({menuOpened}),
    initializeSocket: async function () { 
      
      console.log('try to connect');
      if(!get().socket) {
          const socket = io('http://localhost:5000');
          set({ socket });

          set({connectedSocket : true})
          socket.on('connected', async (data) => {
            console.log('Connected:', data)
            set({connectedSocket : true})

          });
          socket.on('disconnect', async () => {
              set({connectedSocket : false})
          });
          socket.on('message', (data) => {
            console.log('Response from server:', data);
          });
          const {camera_feed} = get()
          socket.on('camera_feed',camera_feed)
          socket.on('speed', (data) => {
            set({speed : data.speed})
        });
      }
    },
    sendDirection: async function (direction) {
      const {socket } = get()
      console.log(`Sending direction: ${direction}`);
      socket.emit("moveDirection", { direction: direction });
    },
    initializeRos : function(){

      const rs = new ROSLIB.Ros({
        url : 'ws://localhost:9090'
      })

      rs.on('connection', () => {
        console.log('Connected to ROS');
        set({connectedRos : true})
      });

      rs.on('error', (error) => {
          console.error('Error connecting to ROS:', error); 
          set({connectedRos : false})
      });

      rs.on('close', () => {
          console.log('Connection to ROS closed.');
          set({connectedRos : false})
      });
      set({ros : rs})
    },
    camera_feed : async function(data){

        set({cameraData : data.image})
    }

}));

