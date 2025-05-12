
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { mockCourses } from '@/services/mockData';

interface FeedbackFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const formSchema = z.object({
  targetType: z.enum(['faculty', 'course', 'college']),
  targetId: z.string().min(1, { message: 'Please select a target' }),
  content: z.string().min(10, { message: 'Feedback must be at least 10 characters' }),
  isAnonymous: z.boolean().default(true),
  isSensitive: z.boolean().default(false),
  acknowledgePolicy: z.boolean().refine(val => val === true, {
    message: "You must acknowledge the feedback policy"
  })
});

const FeedbackForm = ({ onSuccess, onCancel }: FeedbackFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetType, setTargetType] = useState<'faculty' | 'course' | 'college'>('faculty');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetType: 'faculty',
      targetId: '',
      content: '',
      isAnonymous: true,
      isSensitive: false,
      acknowledgePolicy: false
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success toast
      toast.success('Feedback submitted successfully', {
        description: values.isAnonymous 
          ? 'Your anonymous feedback has been recorded.' 
          : 'Your feedback has been recorded.'
      });
      
      // Reset form
      form.reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to submit feedback', {
        description: 'An error occurred while submitting your feedback.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTargetTypeChange = (value: string) => {
    setTargetType(value as 'faculty' | 'course' | 'college');
    form.setValue('targetId', '');
  };

  // Mock data for demonstration purposes
  const mockFaculty = [
    { id: 'faculty1', name: 'Dr. Sarah Thomas' },
    { id: 'faculty2', name: 'Prof. James Wilson' },
    { id: 'faculty3', name: 'Dr. Emily Johnson' }
  ];

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="targetType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback Target Type</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleTargetTypeChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select what you want to give feedback about" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose whether your feedback is about a faculty member, course, or the college in general
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {targetType !== 'college' && (
            <FormField
              control={form.control}
              name="targetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {targetType === 'faculty' ? 'Faculty Member' : 'Course'}
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select a ${targetType}`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {targetType === 'faculty' ? (
                        mockFaculty.map((faculty) => (
                          <SelectItem key={faculty.id} value={faculty.id}>
                            {faculty.name}
                          </SelectItem>
                        ))
                      ) : (
                        mockCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code}: {course.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts, concerns, or suggestions"
                    {...field}
                    rows={5}
                  />
                </FormControl>
                <FormDescription>
                  Be constructive and specific in your feedback
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isAnonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Submit Anonymously</FormLabel>
                  <FormDescription>
                    Your identity will not be revealed with the feedback
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isSensitive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Mark as Sensitive Content</FormLabel>
                  <FormDescription>
                    For issues related to misconduct, discrimination, or safety concerns
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="acknowledgePolicy"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I acknowledge that all feedback should be respectful and constructive
                  </FormLabel>
                  <FormDescription>
                    Inappropriate or abusive feedback may result in disciplinary action
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackForm;
