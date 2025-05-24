"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataRequestFormSchema, type DataRequestFormData } from "@/lib/schemas";
import type { BusinessData } from "@/types";
import { mockBusinessData } from "@/lib/constants";
import { Loader2, Search, DatabaseZap, Building, Globe, Mail, Phone, MapPin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DataRequestPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BusinessData[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const form = useForm<DataRequestFormData>({
    resolver: zodResolver(DataRequestFormSchema),
    defaultValues: {
      geographicRange: "",
      businessType: "",
    },
  });

  const onSubmit = (data: DataRequestFormData) => {
    setIsLoading(true);
    setSearchPerformed(true);
    // Simulate API call
    setTimeout(() => {
      // Simple mock filter - in a real app, this would be a backend query
      const filteredResults = mockBusinessData.filter(biz => 
        (biz.category?.toLowerCase().includes(data.businessType.toLowerCase()) || 
         biz.name.toLowerCase().includes(data.businessType.toLowerCase())) &&
        (biz.address?.toLowerCase().includes(data.geographicRange.toLowerCase()))
      );
      setResults(filteredResults.slice(0, 5)); // Limit to 5 results for demo
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-foreground flex items-center">
        <DatabaseZap className="mr-2 h-6 w-6 text-primary" />
        Data Request Interface
      </h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Request Database Information</CardTitle>
          <CardDescription>
            Specify geographic range and business type to query information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="geographicRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geographic Range</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., San Francisco, CA or Zip Code 94107" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type / Keyword</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Restaurants, IT Services, Bookstores" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Searching..." : "Search Database"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {searchPerformed && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Search Results ({results.length})</h3>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Fetching data...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((biz) => (
                <Card key={biz.id} className="bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="mr-2 h-5 w-5 text-primary" /> {biz.name}
                    </CardTitle>
                    {biz.category && <CardDescription>{biz.category}</CardDescription>}
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {biz.website && (
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                        <a href={biz.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                          {biz.website}
                        </a>
                      </div>
                    )}
                    {biz.phone && (
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{biz.phone}</span>
                      </div>
                    )}
                    {biz.email && (
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{biz.email}</span>
                      </div>
                    )}
                    {biz.address && (
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{biz.address}</span>
                      </div>
                    )}
                    {biz.details && (
                        <p className="text-xs text-muted-foreground pt-2">{biz.details}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <Alert variant="default" className="border-primary">
                <Search className="h-4 w-4 text-primary" />
                <AlertTitle>No Results Found</AlertTitle>
                <AlertDescription>
                  Your search did not return any results. Try different keywords or a broader geographic range.
                </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
