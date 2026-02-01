import React from 'react'

const OnboardingPage = () => {
  const {data:authData,isLoading} = useQuery({
    queryFn:async () =>{
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry:false //auth check
  });

  return <div>OnboardingPage</div>
}

export default OnboardingPage