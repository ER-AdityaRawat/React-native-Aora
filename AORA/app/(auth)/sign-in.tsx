import { View, Text ,ScrollView,Image,Alert} from 'react-native'
import React ,{useState}from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '../../constants/images';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link,router} from 'expo-router';
import { getCurrentUser, signIn } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/globalProvider';


const SignIn = () => {
  const {setUser,setIsLoggedIn}:any=useGlobalContext();
  const [form, setForm] = useState({
    email:'',
    password:""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submit=async()=>{
    if(!form.email||!form.password){
      Alert.alert('Error','Please fill in all the fields');
    }
    else{
      setIsSubmitting(true);
      try{
        await signIn(form.email,form.password);
        const result=await getCurrentUser();
        if(result){
          setUser(result)
          setIsLoggedIn(true);
          Alert.alert("Success","User signed in successfully");
          router.replace('/home')
        }
        
      }catch(error:any){
        Alert.alert('Error',error.message)
      }
      finally{
        setIsSubmitting(false);
      }
    }
    
   
  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 items-center'>
          <Image
            source={images.logo}
            className='w-[130px] h-[86px]'
            resizeMode='contain'
          />
          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
            Log in to Aora
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e:any)=>
              setForm({...form,email:e})
            }
            otherStyles="mt-7"
            keyboardType="email-address"
          />  
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e:any)=>
              setForm({...form,password:e})
            }
            otherStyles="mt-7"
          />  
          <CustomButton
            title="Log In"
            handlePress={submit}
            containerStyles="mt-7 w-full"
          />
          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Don't have an account?
            </Text>
            <Link href={"/sign-up"} className='text-lg font-psemibold text-secondary'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn