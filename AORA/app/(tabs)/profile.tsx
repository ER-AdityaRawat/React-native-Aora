import { StyleSheet, Text, View,FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect }  from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppWrite from '../../lib/useAppWrite'
import { getUserPosts, signOut } from '../../lib/appwrite'
import VideoCard from '../../components/VideoCard'
import EmptyState from '../../components/EmptyState'
import { useGlobalContext } from '../../context/globalProvider';
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'

const Profile = () => {
  const {isLoggedIn,user,setUser,setIsLoggedIn}:any=useGlobalContext();
  const {data:posts,isLoading,refetch}:any=useAppWrite(()=>getUserPosts(user.$id));
 
  const logout=async()=>{
    await signOut()
    setUser(null)
    setIsLoggedIn(false);
    router.replace('/sign-in');
  }
  return (
    
    <SafeAreaView className='bg-primary  h-full'>
    <FlatList
      data={posts}
      keyExtractor={(item:any)=>item.id}
      renderItem={({item})=>(
        <VideoCard
          video={item}
        />
      )}
      ListHeaderComponent={()=>(
        <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
          <TouchableOpacity className='w-full items-end mb-10' onPress={logout}>
            <Image 
              source={icons.logout}
              resizeMode='contain'
              className='w-6 h-6'
            />
          </TouchableOpacity>
          <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center '>
            <Image
              source={{uri:user?.avatar}}
              className='w-[90%] h-[90%] rounded-lg'
              resizeMode='cover'
            />
          </View>
          <InfoBox
            title={user?.username}
            containerStyles="mt-5"
            titleStyles="text-lg"
          />
          <View className='mt-5 flex-row'>
            <InfoBox
              title={posts.length||0}
              subTitle="Posts"
              containerStyles="mr-10"
              titleStyles="text-xl"
            />
            <InfoBox
            title="1.2k"
            subTitle="Followers"
            // containerStyles="mt-5"
            titleStyles="text-xl"
            />
          </View>
        </View>
        
      )}
      ListEmptyComponent={()=>(
        <EmptyState
          title="No Videos Found"
          subTitle="No videos found fro this search query"
        />
       
      )}
      // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
    />
  </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({})