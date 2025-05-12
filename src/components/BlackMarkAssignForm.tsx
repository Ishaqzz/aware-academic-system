
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlackMarkType, BlackMarkSeverity } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
import { Slider } from '@/components/ui/slider';
import { AlertCircle } from 'lucide-react';

interface BlackMarkAssignFormProps {
  userId: string;
  userRole: string;
  userName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const formSchema = z.object({
  type: z.enum(['absenteeism', 'misconduct', 'academic_dishonesty', 'property_damage', 'rule_violation']),
  severity: z.enum(['low', 'medium', 'high']),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  points: z.number().min(1).max(5),
  context: z.string().optional()
});

const BlackMarkAssignForm = ({ 
  userId, 
  userRole, 
  userName, 
  onSuccess,
  onCancel 
}: BlackMarkAssignFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'absenteeism',
      severity: 'low',
      description: '',
      points: 1,
      context: ''
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success toast
      toast.success('Black mark assigned successfully', {
        description: `${userName} has been assigned ${values.points} black mark points.`
      });
      
      // Reset form
      form.reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to assign black mark', {
        description: 'An error occurred while assigning the black mark.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const blackMarkTypes: { value: BlackMarkType; label: string }[] = [
    { value: 'absenteeism', label: 'Absenteeism' },
    { value: 'misconduct', label: 'Misconduct' },
    { value: 'academic_dishonesty', label: 'Academic Dishonesty' },
    { value: 'property_damage', label: 'Property Damage' },
    { value: 'rule_violation', label: 'Rule Violation' }
  ];

  const blackMarkSeverities: { value: BlackMarkSeverity; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  return (
    <div className="space-y-4 p-1">
      <div className="flex items-center gap-2 text-amber-500 bg-amber-50 p-3 rounded-md mb-4">
        <AlertCircle size={20} />
        <p className="text-sm">AI will analyze this black mark in context with {userName}'s history and behavior patterns.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Violation</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select violation type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {blackMarkTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {blackMarkSeverities.map((severity) => (
                      <SelectItem key={severity.value} value={severity.value}>
                        {severity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide details of the incident"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points ({field.value})</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                    className="py-4"
                  />
                </FormControl>
                <FormDescription>
                  Higher points for more severe or repeated violations
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="context"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Context (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any relevant context that AI should consider"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This helps the AI make fair evaluations
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-2">
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
              {isSubmitting ? 'Assigning...' : 'Assign Black Mark'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BlackMarkAssignForm;
