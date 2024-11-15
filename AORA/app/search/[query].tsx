import { View, Text,FlatList, } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppWrite from '../../lib/useAppWrite'
import { searchPosts } from '../../lib/appwrite'
import VideoCard from '../../components/VideoCard'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'

const Search = () => {
  const {query}=useLocalSearchParams();
  const {data:posts,isLoading,refetch}:any=useAppWrite(()=>searchPosts(query));
  useEffect(()=>{
    refetch();
  },[query])
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
          <View className='my-6 px-4 '>
            <Text className='font-pmedium text-sm text-gray-100'>Search Results</Text>
            <Text className='text-2xl font-psemibold text-white'>{query}</Text>
            <View className='mt-6 mb-8'>
              <SearchInput initialQuery={query}/>
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

export default Search