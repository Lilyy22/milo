import React from 'react'
import DataPortal from './data-portal'
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";



const GenerateArticlePage =  () => {
  return (
    <div>
      <DataPortal/>
    </div>
  )
}

export default GenerateArticlePage