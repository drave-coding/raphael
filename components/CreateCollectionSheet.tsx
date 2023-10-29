import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { useForm } from 'react-hook-form';
import { createCollectionSchema, createCollectionSchemaType } from '@/schema/createCollection';
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { createCollection } from "@/actions/collection";
import { toast } from "./ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";


interface Props {
    open: boolean,
    onOpenChange: (open:boolean) => void;
}

function CreateCollectionSheet({open ,onOpenChange} : Props) {

    const form = useForm<createCollectionSchemaType>({
        resolver: zodResolver(createCollectionSchema),
        defaultValues: {},
    })
    const router = useRouter();

    const onSubmit = async (data: createCollectionSchemaType) => {
        try {
            await createCollection(data);
            //reset the form
            openChangeWrapper(false);
            router.refresh();
            //show toast
            toast({
                title: "Success",
                description: "Collection created successfully",
                
            })
            
        } catch (e:any) {
            //show toast
            toast({
                title: "Error",
                description: "Something went Wrong, Please try again",
                variant:"destructive",
            });
            console.log('error while creating collection',e)
        }
    }

    const openChangeWrapper = (open:boolean) => {
        form.reset();
        onOpenChange(open)
    }


  return (
    <Sheet open={open} onOpenChange={openChangeWrapper}> 
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Add a new WorkSpace</SheetTitle>
                <SheetDescription >
                    WorkSpaces are the Way to Manage your Work
                </SheetDescription>
            </SheetHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 flex flex-col'>
                    {/* For name */}
                    <FormField
                        control={form.control}
                        name='name'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className='flex mt-4'>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Personal Name" {...field} />
                                </FormControl>
                                <FormDescription>WorkSpace Name</FormDescription>
                            </FormItem>
                        )}
                    />
                    {/* for color */}
                    <FormField
                        control={form.control}
                        name='color'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                   
                                    <Select onValueChange={(color) => field.onChange(color)}>
                                        <SelectTrigger className={cn("w-full h-8 text-white" , CollectionColors[field.value as CollectionColor])}>
                                            <SelectValue
                                                placeholder = 'Color'
                                                className='w-full h-8'
                                            />
                                        </SelectTrigger>
                                        <SelectContent className='w-full'>
                                            {Object.keys(CollectionColors).map((color) => (
                                                <SelectItem key={color} value={color} className={cn(
                                                    `w-full h-8 rounded-md my-1 text-white focus:text-white focus:font-bold focus:ring-2 ring-neutral-600 focus:ring-inset dark:focus:ring-white focus:px-8`,
                                                    CollectionColors[color as CollectionColor]
                                                  )}>
                                                    {color}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                </FormControl>
                                <FormDescription>Select a Color for your WorkSpace</FormDescription>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            <div className="flex flex-col gap-4 mt-4">
                <Separator/>
                <Button
                disabled={form.formState.isSubmitting}
                    variant={"outline"}
                    className={cn(
                        form.watch("color") && CollectionColors[form.getValues("color") as CollectionColor])}
                onClick={form.handleSubmit(onSubmit)}>
                    Confirm
                    {form.formState.isSubmitting && (
                        <ReloadIcon className='h-4 ml-2 w-4 animate-spin'/>
                    )}
                </Button>
            </div>
            
        </SheetContent>
    </Sheet>
  )
}

export default CreateCollectionSheet
