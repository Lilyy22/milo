// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { google } from "googleapis";
// import { OpenAI, toFile } from "openai";
// import { Readable } from "stream";
// import { backOff } from "exponential-backoff";

// const prisma = new PrismaClient();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );
// oAuth2Client.setCredentials({
//   refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
// });
// const drive = google.drive({ version: "v3", auth: oAuth2Client });
// const docs = google.docs({ version: "v1", auth: oAuth2Client });
// const newOwnerEmail = process.env.GOOGLE_DRIVE_NEW_OWNER_EMAIL;
// // Define the strategy interface
// interface ArticleGenerationStrategy {
//   generateArticle(data: any): Promise<string>;
//   getInitialPrompt(data: any): string;
//   getFollowUpPrompt(data: any): string;
// }

// // Implement concrete strategies for each category
// class FeatureStoryStrategy implements ArticleGenerationStrategy {
//   async generateArticle(data: any): Promise<string> {
//     return await generateWithAssistant(data, "asst_AjYXgYxxWOZ7LeLT6gXKV7zT");
//   }

//   getInitialPrompt(data: any): string {
//     return `I understand there are length limitations for responses. Please generate Part 1 of a detailed article about ${data.clientName}. 
//         Make it comprehensive and well-structured, focusing on their background and early career. 
//         After you provide Part 1, I will ask for additional parts to complete the article.
//         Do not include any concluding statements or notes about additional parts.
//         Simply end your response with the last sentence of the content.`;
//   }

//   getFollowUpPrompt(data: any): string {
//     return `Please provide Part 2 of the article about ${data.clientName}, focusing specifically on their achievements, impact, and current work, at the end of the article make a conclusion. 
//         Make sure it flows naturally from Part 1 and doesn't repeat information.
//         Simply end your response with the last sentence of the content. `;
//   }
// }

// class InterviewArticleStrategy implements ArticleGenerationStrategy {
//   async generateArticle(data: any): Promise<string> {
//     return await generateWithAssistant(data, "asst_vYA68qnn4Ie5wi3dQIVux56y");
//   }

//   getInitialPrompt(data: any): string {
//     return `Please generate Part 1 of an interview-style article about ${data.clientName}. 
//         Structure it as a Q&A format, using the provided interview responses.
//         Focus on their background, journey, and key insights.
//         Keep the conversational tone while maintaining professionalism.
//         Do not include any concluding statements or notes about additional parts.`;
//   }

//   getFollowUpPrompt(data: any): string {
//     return `Please provide Part 2 of the interview article with ${data.clientName}, 
//         continuing in Q&A format and focusing on their expertise, achievements, and vision for the future, at the end make a conclusion.
//         Maintain the natural flow of conversation from Part 1.`;
//   }
// }

// class PressReleaseStrategy implements ArticleGenerationStrategy {
//   async generateArticle(data: any): Promise<string> {
//     return await generateWithAssistant(data, "asst_d9jJhorijYcMKl5NnkTxvCCg");
//   }

//   getInitialPrompt(data: any): string {
//     return `I understand there are length limitations for responses. Please generate Part 1 of a detailed article about ${data.clientName}. 
//         Make it comprehensive and well-structured, focusing on their background and early career. 
//         After you provide Part 1, I will ask for additional parts to complete the article.
//         Do not include any concluding statements or notes about additional parts.
//         Simply end your response with the last sentence of the content.`;
//   }

//   getFollowUpPrompt(data: any): string {
//     return `Please provide Part 2 of the article about ${data.clientName}, focusing specifically on their achievements, impact, and current work. 
//         Make sure it flows naturally from Part 1 and doesn't repeat information.
//         Do not include any concluding statements or notes about additional parts.
//         Simply end your response with the last sentence of the content.`;
//   }
// }

// // Context class to use the strategies
// class ArticleGenerator {
//   private strategy: ArticleGenerationStrategy;

//   constructor(category: string) {
//     switch (category) {
//       case "Feature Stories":
//         this.strategy = new FeatureStoryStrategy();
//         break;
//       case "Interview Articles":
//         this.strategy = new InterviewArticleStrategy();
//         break;
//       case "Press Releases":
//         this.strategy = new PressReleaseStrategy();
//         break;
//       default:
//         throw new Error("Invalid category");
//     }
//   }

//   async generateArticle(data: any): Promise<string> {
//     return await this.strategy.generateArticle(data);
//   }
// }

// // async function prepareAssistantAndFiles(
// //   files: { content: string; filename: string }[],
// //   assistantId: string
// // ): Promise<{ assistant: any; thread: any; vectorStore: any }> {
// //   console.log("Starting file preparation and assistant setup...");

// //   // Retrieve the existing assistant:
// //   const assistant = await openai.beta.assistants.retrieve(assistantId);
// //   console.log("Assistant retrieved:", assistant.id);

// //   // // Create a single vector store:
// //   // let vectorStore = await openai.beta.vectorStores.create({
// //   //   name: `combined-files-${Date.now()}`,
// //   // });
// //   // console.log("Vector store created:", vectorStore.id);

// //   // Prepare all files
// //   const openAIFiles = await Promise.all(
// //     files.map(async (file) => {
// //       console.log(
// //         `File size (${file.filename}): ${file.content.length} bytes (${(
// //           file.content.length /
// //           (1024 * 1024)
// //         ).toFixed(2)} MB)`
// //       );
// //       const buffer = Buffer.from(file.content);
// //       const stream = Readable.from(buffer);
// //       return await toFile(stream, file.filename + ".pdf");
// //     })
// //   );

// //   // // Upload all files to vector store
// //   // const uploadResult = await openai.beta.vectorStores.fileBatches.uploadAndPoll(
// //   //   vectorStore.id,
// //   //   {
// //   //     files: openAIFiles,
// //   //   }
// //   // );
// //   // console.log("Files uploaded to vector store:", uploadResult);

// //   // // Update assistant with vector store
// //   // await openai.beta.assistants.update(assistant.id, {
// //   //   tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
// //   // });
// //   // console.log("Assistant updated with vector store");

// //   // const thread = await openai.beta.threads.create();
// //   // console.log("Thread created:", thread.id);

// //   // return { assistant, thread, vectorStore };
// // }

// async function generateWithAssistant(
//   data: any,
//   assistantId: string
// ): Promise<string> {
//   const { assistant, thread, vectorStore } = await prepareAssistantAndFiles(
//     [
//       { content: data.bio, filename: "bio" },
//       { content: data.qa, filename: "qa" },
//     ],
//     assistantId
//   );

//   console.log(`Generating article for client: ${data.clientName}`);
//   console.log(`Using assistant: ${assistantId}`);

//   let fullContent = "";
//   const targetWordCount = 1000;

//   // Get the strategy instance based on the assistant ID
//   const strategy = getStrategyForAssistant(assistantId);

//   // Use strategy-specific prompts
//   await openai.beta.threads.messages.create(thread.id, {
//     role: "user",
//     content: strategy.getInitialPrompt(data),
//   });

//   let run = await openai.beta.threads.runs.create(thread.id, {
//     assistant_id: assistantId,
//   });

//   // Poll for completion
//   let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
//   while (runStatus.status !== "completed") {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
//   }

//   const responseMessages = await openai.beta.threads.messages.list(thread.id);
//   const firstResponse = responseMessages.data.find(
//     (m) => m.role === "assistant"
//   );

//   if (
//     !firstResponse ||
//     !firstResponse.content[0] ||
//     firstResponse.content[0].type !== "text"
//   ) {
//     throw new Error("No valid response from assistant");
//   }

//   fullContent = firstResponse.content[0].text.value.replace(
//     /Part \d+:?\s*/gi,
//     ""
//   );

//   // If we need more content, get Part 2 with specific focus
//   if (fullContent.split(/\s+/).length < targetWordCount) {
//     // Clear previous messages to avoid context confusion
//     const messages = await openai.beta.threads.messages.list(thread.id);
//     for (const message of messages.data) {
//       await openai.beta.threads.messages.del(thread.id, message.id);
//     }

//     await openai.beta.threads.messages.create(thread.id, {
//       role: "user",
//       content: strategy.getFollowUpPrompt(data),
//     });

//     run = await openai.beta.threads.runs.create(thread.id, {
//       assistant_id: assistantId,
//     });

//     runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
//     while (runStatus.status !== "completed") {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
//     }

//     const secondResponse = (
//       await openai.beta.threads.messages.list(thread.id)
//     ).data.find((m) => m.role === "assistant");

//     if (secondResponse?.content[0]?.type === "text") {
//       const part2Content = secondResponse.content[0].text.value.replace(
//         /Part \d+:?\s*/gi,
//         ""
//       );
//       fullContent += "\n\n" + part2Content;
//     }
//   }

//   // Apply name rules once at the end
//   fullContent = enforceNameRules(
//     fullContent,
//     data.clientName,
//     data.isBusinessName
//   );

//   console.log(`Final word count: ${fullContent.split(/\s+/).length}`);
//   return fullContent;
// }

// async function saveToGoogleDocs(
//   content: string,
//   folderId: string,
//   fileName: string,
//   newOwnerEmail: string
// ): Promise<string> {
//   const maxRetries = 3;
//   let retryCount = 0;

//   while (retryCount < maxRetries) {
//     try {
//       // Create the document
//       const doc = await docs.documents.create({
//         requestBody: {
//           title: fileName,
//         },
//       });

//       const documentId = doc.data.documentId;
//       if (!documentId) throw new Error("Failed to create document");

//       // Split content into title and body
//       const [title, ...bodyParts] = content.split("\n");
//       const body = bodyParts.join("\n");

//       // Remove '##' markers and prepare content
//       const cleanedContent = body.replace(/##\s*/g, "");

//       // Insert the title and cleaned content
//       await docs.documents.batchUpdate({
//         documentId,
//         requestBody: {
//           requests: [
//             {
//               insertText: {
//                 location: { index: 1 },
//                 text: title + "\n" + cleanedContent,
//               },
//             },
//           ],
//         },
//       });

//       // Apply base formatting to the entire document (Calibri, size 12pt)
//       await docs.documents.batchUpdate({
//         documentId,
//         requestBody: {
//           requests: [
//             {
//               updateTextStyle: {
//                 range: {
//                   startIndex: 1,
//                   endIndex: title.length + cleanedContent.length + 3,
//                 },
//                 textStyle: {
//                   weightedFontFamily: { fontFamily: "Calibri" },
//                   fontSize: { magnitude: 12, unit: "PT" },
//                 },
//                 fields: "weightedFontFamily,fontSize",
//               },
//             },
//           ],
//         },
//       });

//       // Apply styles to the main title (Bold, 16pt)
//       const titleRequests = [
//         {
//           updateTextStyle: {
//             range: { startIndex: 1, endIndex: title.length + 1 },
//             textStyle: {
//               bold: true,
//               fontSize: { magnitude: 16, unit: "PT" },
//             },
//             fields: "bold,fontSize",
//           },
//         },
//       ];

//       await docs.documents.batchUpdate({
//         documentId,
//         requestBody: { requests: titleRequests },
//       });

//       // Find and style section titles (Bold, 14pt for subheadlines)
//       const sectionTitleRegex = /^(.+)$/gm;
//       let match;
//       const sectionTitleRequests = [];
//       let contentIndex = title.length + 3; // Start after title and two newlines

//       while ((match = sectionTitleRegex.exec(cleanedContent)) !== null) {
//         const potentialTitle = match[1].trim();
//         if (body.includes(`## ${potentialTitle}`)) {
//           const startIndex = contentIndex - 1 + match.index;
//           const endIndex = startIndex + potentialTitle.length;
//           sectionTitleRequests.push({
//             updateTextStyle: {
//               range: { startIndex, endIndex },
//               textStyle: {
//                 bold: true,
//                 fontSize: { magnitude: 14, unit: "PT" },
//               },
//               fields: "bold,fontSize",
//             },
//           });
//         }
//       }

//       // Apply section title styles
//       if (sectionTitleRequests.length > 0) {
//         await docs.documents.batchUpdate({
//           documentId,
//           requestBody: { requests: sectionTitleRequests },
//         });
//       }

//       // Find and style bold text within ** markers and ### headers
//       const boldTextRegex = /(\*\*(.+?)\*\*)|(###\s*(.+))/g;
//       const boldTextRequests = [];
//       let boldMatch;

//       while ((boldMatch = boldTextRegex.exec(cleanedContent)) !== null) {
//         const boldText = boldMatch[2] || boldMatch[4]; // Group 2 for **, Group 4 for ###
//         const startIndex = contentIndex + boldMatch.index;
//         const endIndex = startIndex - 1 + boldText.length + 2;
//         boldTextRequests.push({
//           updateTextStyle: {
//             range: { startIndex, endIndex },
//             textStyle: {
//               bold: true,
//             },
//             fields: "bold",
//           },
//         });

//         // If it's a ### header, also increase the font size
//         if (boldMatch[3]) {
//           boldTextRequests.push({
//             updateTextStyle: {
//               range: { startIndex, endIndex },
//               textStyle: {
//                 fontSize: { magnitude: 14, unit: "PT" },
//               },
//               fields: "fontSize",
//             },
//           });
//         }
//       }

//       // Apply bold text styles
//       if (boldTextRequests.length > 0) {
//         await docs.documents.batchUpdate({
//           documentId,
//           requestBody: { requests: boldTextRequests },
//         });
//       }

//       // Remove ** and ### markers from the content
//       const finalContent = cleanedContent
//         .replace(/\*\*/g, "")
//         .replace(/###\s*/g, "");
//       await docs.documents.batchUpdate({
//         documentId,
//         requestBody: {
//           requests: [
//             {
//               replaceAllText: {
//                 containsText: { text: "**" },
//                 replaceText: "",
//               },
//             },
//             {
//               replaceAllText: {
//                 containsText: { text: "###" },
//                 replaceText: "",
//               },
//             },
//           ],
//         },
//       });

//       // Move the document to the client folder
//       await drive.files.update({
//         fileId: documentId,
//         addParents: folderId,
//         removeParents: "root",
//         fields: "id, parents",
//       });

//       // // Change the owner of the document
//       // await drive.permissions.create({
//       //   fileId: documentId,
//       //   requestBody: {
//       //     role: 'owner',
//       //     type: 'user',
//       //     emailAddress: newOwnerEmail,
//       //   },
//       //   transferOwnership: true,
//       // });

//       return documentId;
//     } catch (error) {
//       if (
//         error instanceof Error &&
//         "response" in error &&
//         typeof error.response === "object" &&
//         error.response &&
//         "status" in error.response
//       ) {
//         const status = (error.response as { status: number }).status;
//         if (status === 502) {
//           retryCount++;
//           if (retryCount < maxRetries) {
//             const delay = Math.min(1000 * Math.pow(2, retryCount), 60000); // Exponential backoff with max 60 seconds
//             console.log(
//               `Retrying saveToGoogleDocs (attempt ${
//                 retryCount + 1
//               }) after ${delay}ms`
//             );
//             await new Promise((resolve) => setTimeout(resolve, delay));
//           } else {
//             throw new Error("Max retries reached for saveToGoogleDocs");
//           }
//         } else {
//           throw error;
//         }
//       } else {
//         throw error;
//       }
//     }
//   }

//   throw new Error("Failed to save document after multiple attempts");
// }

// export async function POST(request: NextRequest) {
//   try {
//     const {
//       stageId,
//       clientId,
//       category,
//       folderId,
//       qaId,
//       isBusinessName = false,
//     } = await request.json();
//     const clientFolderId = folderId;

//     // Fetch client data and stage data from the database
//     const clientData = await prisma.clientData.findUnique({
//       where: { id: clientId },
//       include: {
//         qas: true, // Include the QA documents
//       },
//     });

//     const stageData = await prisma.stage.findUnique({
//       where: { id: stageId },
//     });

//     if (!clientData || !stageData) {
//       return NextResponse.json({
//         success: false,
//         error: "Client data or Stage data not found",
//       });
//     }

//     // Determine which QA content to use
//     let qaContent;
//     if (qaId) {
//       const qaIdNumber = typeof qaId === "string" ? parseInt(qaId, 10) : qaId;
//       const selectedQa = clientData.qas.find((doc) => doc.id === qaIdNumber);

//       if (!selectedQa) {
//         return NextResponse.json({
//           success: false,
//           error: "Selected QA document not found",
//         });
//       }
//       qaContent = selectedQa.content;
//     } else {
//       qaContent = clientData.qa;
//     }

//     const articleData = {
//       bio: clientData.bio,
//       qa: qaContent, // Use the determined QA content
//       category: category,
//       clientName: clientData.clientName,
//       isBusinessName: isBusinessName, // Use the flag from the request
//     };

//     // Use the strategy pattern to generate the article
//     const articleGenerator = new ArticleGenerator(category);
//     const articleContent = await articleGenerator.generateArticle(articleData);
//     console.log(
//       `Generated article with ${articleContent.split(/\s+/).length} words`
//     );

//     // Ensure word count is 1000 or more
//     if (articleContent.split(" ").length < 900) {
//       throw new Error(
//         "Article content does not meet the minimum word count of 1000."
//       );
//     }

//     // Save the article to Google Docs in the client folder
//     let documentId;
//     try {
//       documentId = await saveToGoogleDocs(
//         articleContent,
//         clientFolderId!,
//         stageData.name ?? "Untitled",
//         newOwnerEmail!
//       );
//     } catch (error) {
//       console.error("Error saving to Google Docs:", error);
//       return NextResponse.json({
//         success: false,
//         error:
//           "Failed to save document to Google Docs. Please try again later.",
//       });
//     }

//     // Update the stage with the Google Docs URL
//     const updatedStage = await prisma.stage.update({
//       where: { id: stageId },
//       data: {
//         docUrl: `https://docs.google.com/document/d/${documentId}/edit`,
//         status: "Ready",
//       },
//     });

//     return NextResponse.json({ success: true, docUrl: updatedStage.docUrl });
//   } catch (error) {
//     console.error("Error generating or saving document:", error);
//     if (error instanceof Error) {
//       return NextResponse.json({ success: false, error: error.message });
//     } else {
//       return NextResponse.json({
//         success: false,
//         error: "An unknown error occurred",
//       });
//     }
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const { stageId } = await request.json();

//     // Fetch the stage data to get the Google Docs URL
//     const stageData = await prisma.stage.findUnique({
//       where: { id: stageId },
//     });

//     if (!stageData || !stageData.docUrl) {
//       return NextResponse.json({
//         success: false,
//         error: "Stage data or Document URL not found",
//       });
//     }

//     // Extract the document ID from the URL
//     const docUrl = stageData.docUrl;
//     const docId = docUrl.match(/[-\w]{25,}/)?.[0];

//     if (!docId) {
//       throw new Error("Failed to extract document ID from URL");
//     }

//     // Delete the Google Docs document
//     await drive.files.delete({ fileId: docId });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error deleting document:", error);
//     if (error instanceof Error) {
//       return NextResponse.json({ success: false, error: error.message });
//     } else {
//       return NextResponse.json({
//         success: false,
//         error: "An unknown error occurred",
//       });
//     }
//   }
// }
// function removeCitations(content: string): string {
//   // Remove citations in the format 【4:3†qa.pdf】
//   return content.replace(/【\d+:\d+†[^】]+】/g, "");
// }

// function enforceNameRules(
//   content: string,
//   fullName: string,
//   isBusinessName: boolean = false
// ): string {
//   // For business names, we want to keep the full name throughout the document
//   if (isBusinessName) {
//     // Remove citations before processing
//     content = removeCitations(content);

//     // Split the content into title and body
//     let [title, ...bodyParts] = content.split("\n");
//     let body = bodyParts.join("\n");

//     // Remove '#' from the title and trim any leading/trailing whitespace
//     title = title.replace(/^#+\s*/, "").trim();

//     // Ensure full name is in the title
//     if (!title.includes(fullName)) {
//       title = title.replace(
//         new RegExp(escapeRegExp(fullName.split(" ").pop() || ""), "i"),
//         fullName
//       );
//     }

//     // Combine title and body
//     return `${title}\n\n${body}`;
//   }

//   const lastName = fullName.split(" ").pop() || "";

//   // Remove citations before processing
//   content = removeCitations(content);

//   // Split the content into title and body
//   let [title, ...bodyParts] = content.split("\n");
//   let body = bodyParts.join("\n");

//   // Remove '#' from the title and trim any leading/trailing whitespace
//   title = title.replace(/^#+\s*/, "").trim();

//   // Ensure full name is in the title
//   if (!title.includes(fullName)) {
//     title = title.replace(new RegExp(`\\b${lastName}\\b`, "i"), fullName);
//   }

//   // Ensure full name is at the start of the body
//   const firstParagraph = body.split("\n\n")[0];
//   if (!firstParagraph.includes(fullName)) {
//     body = body.replace(
//       firstParagraph,
//       firstParagraph.replace(new RegExp(`\\b${lastName}\\b`, "i"), fullName)
//     );
//   }

//   // Find the last paragraph
//   const paragraphs = body.split("\n\n");
//   let lastParagraph = paragraphs[paragraphs.length - 1];

//   // Ensure full name is in the last paragraph
//   if (!lastParagraph.includes(fullName)) {
//     lastParagraph = lastParagraph.replace(
//       new RegExp(`\\b${lastName}\\b`, "i"),
//       fullName
//     );
//     paragraphs[paragraphs.length - 1] = lastParagraph;
//     body = paragraphs.join("\n\n");
//   }

//   // Replace all other full name mentions with last name
//   body = body.replace(new RegExp(fullName, "g"), (match, index) => {
//     if (index < body.indexOf("\n\n")) return match; // Keep full name in first paragraph
//     if (index > body.lastIndexOf("\n\n")) return match; // Keep full name in last paragraph
//     return lastName;
//   });

//   // Combine title and body
//   content = `${title}\n\n${body}`;

//   return content;
// }

// // Helper function to escape special characters in regex
// function escapeRegExp(string: string): string {
//   return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// }

// // Helper function to get the strategy based on assistant ID
// function getStrategyForAssistant(
//   assistantId: string
// ): ArticleGenerationStrategy {
//   switch (assistantId) {
//     case "asst_AjYXgYxxWOZ7LeLT6gXKV7zT":
//       return new FeatureStoryStrategy();
//     case "asst_vYA68qnn4Ie5wi3dQIVux56y":
//       return new InterviewArticleStrategy();
//     case "asst_d9jJhorijYcMKl5NnkTxvCCg":
//       return new PressReleaseStrategy();
//     default:
//       throw new Error("Invalid assistant ID");
//   }
// }
