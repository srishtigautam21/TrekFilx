import { createContext, useContext, useReducer,useEffect } from "react";
import { videosReducer } from "../../Reducers/videosReducer";
import axios from 'axios';
import { dispatchActioTypes } from "../../Reducers/dispatchActionTypes";

const VideoListingContext = createContext();

const VideoListingProvider = (props) => {
  const [videoListingState, videoListingDispatch] = useReducer(videosReducer, {
    videos: [], //from db
    categoriesData: [], // from db
    categories: {}, //selected by user else All
    isDataLoading:false,
    error:"",
  });

  const {LOADING_DATA,LOAD_DATA,SET_ERROR} = dispatchActioTypes;

  useEffect(() => {
    (async () => {
      try{
        const response = await axios.get('/api/videos')
        console.log(response)
        videoListingDispatch({
          type:LOADING_DATA,
          payload:{status:true}
        })
        if(response.status === 200){
          const videos = response.data.videos;
          videoListingDispatch({
            type:LOAD_DATA,
            payload:{status:false,videos:videos}
          })
        }
      }
      catch (err){
        console.log("Err in video api fetch",err)
        videoListingDispatch({
          type:SET_ERROR,
          payload:{error:err}
        })
      }
    })();
    (async () => {
      try{
        const response = await axios.get('/api/categories')
        console.log(response)
        videoListingDispatch({
          type:LOADING_DATA,
          payload:{status:true}
        })
        if(response.status === 200){
          const categories = response.data.categories;
          const categoriesFilterData = categories.reduce(
            (acc, item) => ({ ...acc, [item.category]: false }),
            {}
          );
          videoListingDispatch({
            type:LOAD_DATA,
            payload:{status:false,categories:categories,categoriesFilterData:categoriesFilterData}
          })
        }
      }
      catch (err){
        console.log("Err in category api fetch",err)
        videoListingDispatch({
          type:SET_ERROR,
          payload:{error:err}
        })
      }
    })();
  }, []);

  return (
    <VideoListingContext.Provider value={{videoListingState,videoListingDispatch}}>
      {props.children}
    </VideoListingContext.Provider>
  );
};

const useVideoListing = () => useContext(VideoListingContext);

export {useVideoListing,VideoListingProvider}