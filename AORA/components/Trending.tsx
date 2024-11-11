import { View, Text,FlatList, TouchableOpacity, ImageBackground ,Image} from 'react-native'
import React,{useState} from 'react';
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants';
import { Video,ResizeMode } from 'expo-av';

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};
const TredingItem=({activeItem,item}:any)=>{
  const [play, setPlay] = useState(false)
  // console.log(item.video_url)
   return(
    <Animatable.View 
      className='mr-5'
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      { play?
      (
        <Video 
          source={{uri:item.video_url}}
          className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status:any)=>{
            if(status.didJustFinish){
              setPlay(false);
            }
          }}
        />
      ):
        <TouchableOpacity 
          className='relative justify-center items-center'
          activeOpacity={0.7}
          onPress={()=>setPlay(true)}
        >
          <ImageBackground 
            source={{uri:item.thumbnail}} 
            className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg
            shadow-black-40'
            resizeMode='cover'
          />
          <Image 
            source={icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'
          
          />
        </TouchableOpacity>
      }
    </Animatable.View>
   )
}
const Trending = ({posts}:any) => {
  const [activeItem, setActiveItem] = useState(posts[1])
  const viewableItemsChange=({viewableItems}:any)=>{
    if(viewableItems.length>0){
      setActiveItem(viewableItems[0].key)
    }
  }
  return (
    <FlatList
    data={posts}
    keyExtractor={(item)=>item.$id}
    renderItem={({item})=>(
      <TredingItem activeItem={activeItem} item={item}/>
    )}
    horizontal
    onViewableItemsChanged={viewableItemsChange}
    viewabilityConfig={{
      itemVisiblePercentThreshold:70
    }}
    // contentOffset={{x:170}}
    />
  )
}

export default Trending