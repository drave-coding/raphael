import CollectionCard from "@/components/CollectionCard";
import SadFace from "@/components/icons/SadFace";
import CreateCollectionBtn from "@/components/ui/CreateCollectionBtn";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";

import { currentUser } from "@clerk/nextjs"
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback/>}>
        <WelcomeMsg/>
      </Suspense>
      <Suspense fallback={<div>Loading WorkSpaces</div>}>
        <CollectionList/>
      </Suspense>
      
    </>
  )
}

async function WelcomeMsg( ) {
  const user = await currentUser();
  

  if(!user) {
    return <div>Error</div>
  }
  return (  
    <div className=" flex w-full mb-12">
      <h1 className="text-4xl font-bold font-serif ">
        Welcome, <br /> {user.firstName} {user.lastName}
      </h1>
    </div>
  )
}

function WelcomeMsgFallback() {
  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        <Skeleton className="w-[180px] h-[36px]"/>
        <Skeleton className="w-[150px] h-[36px]"/>
      </h1>

    </div>
  )
}

async function CollectionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user?.id
    },
  });
  if(collections.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <Alert>
          <SadFace/>
          <AlertTitle>There are no WorkSpaces on your Domain</AlertTitle>
          <AlertDescription>Create a WorkSpace to Begin your Journey</AlertDescription>
        </Alert>
        <CreateCollectionBtn/>
      </div>
    )
  }
  return(
    <>
      <CreateCollectionBtn />
      <div className="flex flex-col gap-4 mt-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  )
  
}

