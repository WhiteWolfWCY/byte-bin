import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SearchIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  query: z.string().min(0).max(200),
});

export function SearchBar({ query, setQuery}: { query: string, setQuery: Dispatch<SetStateAction<string>>}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setQuery(values.query)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="File title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting}
            className="flex gap-1"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <SearchIcon className="w-4 h-4"/> Search
          </Button>
        </form>
      </Form>
    </div>
  );
}
