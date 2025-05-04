"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { templates } from "@/constants/templates";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export const TemplatesGallery = () => {
    const router = useRouter();
    const create  = useMutation(api.documents.create);
    
    const [isCreating, setIsCreating] = useState(false);

    const onTemoplateClick = (title: string, initialContent: string) => {
        setIsCreating(true);
        create({title, initialContent})
        .catch(() => toast.error("Something went wrong"))
        .then((documentId) => {
            toast.success("Document created successfully")
            router.push(`/documents/${documentId}`);
        })
        .finally(() => {
            setIsCreating(false);
        });
    };
    
    return (

        <div className="bg-[#F1F3F4]">
            <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
                <h3 className="font-medium">Start a new document</h3>
                <Carousel>
                    <CarouselContent className="-ml-4">
                        {templates.map((template) => (
                            <CarouselItem
                                key={template.id}
                                className="basic-1/2 sm:basic-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4"
                            >
                                <div
                                    className={cn(
                                        "aspect-[3/4] flex flex-col gap-y-2.5",
                                        isCreating && "pointer-events-none opacity-50"
                                    )}
                                >
                                    <button
                                        disabled={isCreating}
                                        onClick={() => onTemoplateClick(template.label, template.initialContent)}
                                        style={{
                                            backgroundImage: `url(${template.imageUrl})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            backgroundRepeat: "no-repeat",
                                        }}
                                        className="size-full hover:border-neutral-950 rounded-sm border hover:bg-blue-50 transition flex flex-col items-center justify-center gap-y-4 bg-white"
                                    />
                                    <p className="text-sm font-medium truncate">
                                            {template.label}
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
            </div>
        </div>
    );
};

// "use client";

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel"
// import { templates } from "@/constants/templates";
// import { useMutation } from "convex/react";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { api } from "../../../convex/_generated/api";
// import { useState } from "react";
// import { toast } from "sonner";

// export const TemplatesGallery = () => {
//   const router = useRouter();
//   const createDocument = useMutation(api.documents.create);
//   const createNote = useMutation(api.notes.createDocumentNote);
//   const [isCreating, setIsCreating] = useState(false);

//   const onTemplateClick = (title: string, initialContent: string) => {
//     setIsCreating(true);
    
//     createDocument({ title, initialContent })
//       .then((documentId) => {
//         if (!documentId) throw new Error("Document creation failed");
        
//         // Create initial note for the document
//         return createNote({
//           documentId,
//           content: "Initial thoughts about this document",
//           color: "bg-blue-100",
//           heading: "First Note",
//         }).then(() => documentId);
//       })
//       .then((documentId) => {
//         toast.success("Document created successfully");
//         router.push(`/documents/${documentId}`);
//       })
//       .catch(() => toast.error("Something went wrong"))
//       .finally(() => setIsCreating(false));
//   };
  
//   return (
//     <div className="bg-[#F1F3F4]">
//       <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
//         <h3 className="font-medium">Start a new document</h3>
//         <Carousel>
//           <CarouselContent className="-ml-4">
//             {templates.map((template) => (
//               <CarouselItem
//                 key={template.id}
//                 className="basic-1/2 sm:basic-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4"
//               >
//                 <div
//                   className={cn(
//                     "aspect-[3/4] flex flex-col gap-y-2.5",
//                     isCreating && "pointer-events-none opacity-50"
//                   )}
//                 >
//                   <button
//                     disabled={isCreating}
//                     onClick={() => onTemplateClick(template.label, template.initialContent)}
//                     style={{
//                       backgroundImage: `url(${template.imageUrl})`,
//                       backgroundSize: "cover",
//                       backgroundPosition: "center",
//                       backgroundRepeat: "no-repeat",
//                     }}
//                     className="size-full hover:border-neutral-950 rounded-sm border hover:bg-blue-50 transition flex flex-col items-center justify-center gap-y-4 bg-white"
//                   />
//                   <p className="text-sm font-medium truncate">
//                     {template.label}
//                   </p>
//                 </div>
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//           <CarouselPrevious/>
//           <CarouselNext/>
//         </Carousel>
//       </div>
//     </div>
//   );
// };