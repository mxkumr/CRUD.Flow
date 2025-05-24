
"use client";

import React, { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataRequestFormSchema, type DataRequestFormData } from "@/lib/schemas";
import type { BusinessData, SystemUser } from "@/types";
import { getAssignableUsers } from "@/types"; // To get users for assignment
import { fetchBusinessDataAction } from "@/actions/data-request-actions";
import { Loader2, Search, DatabaseZap, Building, Globe, Mail, Phone, MapPin, Download, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export function DataRequestPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BusinessData[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<SystemUser[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch assignable users when component mounts
    // Passing no panelType to getAssignableUsers will return all approved users.
    setAssignableUsers(getAssignableUsers());
  }, []);

  const form = useForm<DataRequestFormData>({
    resolver: zodResolver(DataRequestFormSchema),
    defaultValues: {
      geographicRange: "",
      businessType: "",
      assignedToUserId: undefined, // Ensure it's initially undefined or an empty string for "Unassigned"
    },
  });

  const onSubmit = async (data: DataRequestFormData) => {
    setIsLoading(true);
    setSearchPerformed(true);
    setResults([]); 

    const dataToSubmit = {
      ...data,
      assignedToUserId: data.assignedToUserId === "unassigned" || data.assignedToUserId === "" ? undefined : data.assignedToUserId,
    };

    const response = await fetchBusinessDataAction(dataToSubmit);

    if (response.success && response.data) {
      setResults(response.data);
      if (response.data.length === 0) {
        toast({
          title: "No Results",
          description: "Your search criteria did not match any businesses in the mock data.",
        });
      } else {
         toast({
          title: "Search Complete",
          description: `Found ${response.data.length} businesses. Data (mock) saved to 'database'.`,
        });
      }
    } else {
      toast({
        title: "Search Failed",
        description: response.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const convertToCSV = (data: BusinessData[]) => {
    if (!data || data.length === 0) return "";
    const headers = ["Name", "Website", "Phone", "Email", "Address", "Category", "Details"];
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        [
          `"${row.name?.replace(/"/g, '""') || ''}"`,
          `"${row.website || ''}"`,
          `"${row.phone || ''}"`,
          `"${row.email || ''}"`,
          `"${row.address?.replace(/"/g, '""').replace(/\n/g, ' ') || ''}"`,
          `"${row.category?.replace(/"/g, '""') || ''}"`,
          `"${row.details?.replace(/"/g, '""').replace(/\n/g, ' ') || ''}"`
        ].join(',')
      )
    ];
    return csvRows.join('\n');
  };

  const handleExportCSV = () => {
    if (results.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Perform a search to get data before exporting.",
        variant: "destructive"
      });
      return;
    }
    const csvData = convertToCSV(results);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'business_data_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: "CSV file has been downloaded.",
      });
    } else {
       toast({
        title: "Export Failed",
        description: "Your browser does not support direct CSV downloads.",
        variant: "destructive"
      });
    }
  };


  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-foreground flex items-center">
          <DatabaseZap className="mr-2 h-6 w-6 text-primary" />
          Data Request Interface
        </h2>
        <Button onClick={handleExportCSV} variant="outline" disabled={results.length === 0 || isLoading}>
          <Download className="mr-2 h-4 w-4" /> Export Results to CSV
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Request & Assign Business Data</CardTitle>
          <CardDescription>
            Specify criteria to query information and optionally assign it to a user. Data is saved to Firestore. (Currently uses MOCK Google Places data).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="geographicRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Geographic Range</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., San Francisco, CA" {...field} />
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
                        <Input placeholder="E.g., Restaurants" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="assignedToUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to User (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "unassigned"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user to assign data to" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unassigned">Don't Assign / Unassigned</SelectItem>
                        {assignableUsers.length === 0 && <SelectItem value="loading" disabled>Loading users...</SelectItem>}
                        {assignableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.desiredRole})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                {isLoading ? "Searching & Saving..." : "Search & Save to Database"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {searchPerformed && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Search Results ({results.length})</h3>
          {isLoading && results.length === 0 ? ( 
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Fetching data...</p>
            </div>
          ) : !isLoading && results.length === 0 ? ( 
             <Alert variant="default" className="border-primary">
                <Search className="h-4 w-4 text-primary" />
                <AlertTitle>No Results Found</AlertTitle>
                <AlertDescription>
                  Your search did not return any results. Try different keywords or a broader geographic range.
                </AlertDescription>
            </Alert>
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
                    {/* Display assigned user if present - this would be from the initially fetched data */}
                    {biz.assignedToUserId && assignableUsers.find(u => u.id === biz.assignedToUserId) && (
                      <div className="flex items-center pt-2 mt-2 border-t border-border/50">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Assigned to: {assignableUsers.find(u => u.id === biz.assignedToUserId)?.name}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null }
        </div>
      )}
    </div>
  );
}

