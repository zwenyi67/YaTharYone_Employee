import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CircleChevronLeft } from 'lucide-react';
import api from '@/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { AddSupplierPayloadType, UpdateSupplierPayloadType } from '@/api/supplier/types';
import { t } from 'i18next';
import { hideLoader, openLoader } from '@/store/features/loaderSlice';
import { useDispatch } from 'react-redux';


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Supplier name must be at least 2 characters.",
  }),
  profile: z
    .union([
      z.string().optional(),
      z
        .instanceof(File)
        .refine(
          (file) =>
            ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
          {
            message: "Only PNG, JPG, or JPEG files are allowed.",
          }
        ),
    ])
    .optional(),
  contact_person: z.string().min(3, {
    message: "Contact Person must be at least 3 characters.",
  }),
  business_type: z.string().min(3, {
    message: "Business Type must be at least 3 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  email: z.string().email({
    message: "Must be a valid email address.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  createby: z.number().optional(), // Assuming this is optional for the form
});

export default function SupplierFormView() {

  const navigate = useNavigate();

  const location = useLocation();
  const { id } = useParams();

  const dispatch = useDispatch();

  const passedData = location.state?.data;

  const sup: AddSupplierPayloadType = id
    ? { ...passedData }
    : {
      name: "",
      profile: undefined,
      contact_person: "",
      phone: "",
      email: "",
      business_type: "",
      address: "",
      createby: 1,
    };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: sup?.name || "",
      profile: sup?.profile,
      contact_person: sup?.contact_person,
      phone: sup?.phone || "",
      email: sup?.email || "",
      business_type: sup?.business_type || "",
      address: sup?.address || "",
      createby: sup?.createby || 1,
    },
  });

  const { mutate: addSupplier } =
    api.supplier.addSupplier.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      },
      onSuccess: () => {
        toast({
          title: "New Supplier added successfully",
          variant: "success",
        });
        navigate("/supplier-management/suppliers");
      },
      onError: (error) => {
        form.setError("name", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        dispatch(hideLoader());
      },
    });

  const { mutate: updateSupplier } =
    api.supplier.updateSupplier.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      }, onSuccess: () => {
        toast({
          title: "Supplier updated successfully",
          variant: "success",
        });
        navigate("/supplier-management/suppliers");
      },
      onError: (error) => {
        form.setError("name", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        dispatch(hideLoader());
      },
    });


  const onSubmit = async (sup: z.infer<typeof formSchema>) => {
    try {
      // Format dates and create FormData
      const formData = new FormData();
      formData.append("name", sup.name);

      // Handle profile based on whether it's a file or an existing URL
      const profile = form.getValues("profile");
      if (profile instanceof File) {
        formData.append("profile", profile); // Append the new file
      } else if (id && sup.profile) {
        formData.append("profile", sup.profile); // Append the existing profile URL
      }

      formData.append("contact_person", sup.contact_person);
      formData.append("phone", sup.phone);
      formData.append("email", sup.email);
      formData.append("business_type", sup.business_type);
      formData.append("address", sup.address);

      if (id) {
        // For edit form
        formData.append("updateby", (sup.createby || 1).toString());
        formData.append("id", id);

        // Call update API
        await updateSupplier(formData as unknown as UpdateSupplierPayloadType);
      } else {
        // For add form
        formData.append("createby", (sup.createby || 1).toString());

        // Call add API
        await addSupplier(formData as unknown as AddSupplierPayloadType);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (id && sup.profile) {
      const fileUrl = "http://127.0.0.1:8000" + sup.profile;
      setPreview(fileUrl); // Set the preview to the existing profile URL
      //form.setValue("profile", null); // Do not set the profile as a File yet
    }
  }, [id, sup.profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setFileError("Only PNG, JPG, or JPEG files are allowed.");
        setPreview(preview); // Keep the existing preview
        return;
      }

      setFileError(null);
      form.setValue("profile", file); // Set the file in the form state
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string); // Show preview as base64 URL
      reader.readAsDataURL(file);
    }
  };



  return (
    <section className="m-4">
      <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
        {t("title.supplier-management")}
      </div>
      <div className="p-6 bg-white rounded-lg">
        <div className='flex mb-8'>
          <div className='me-5'>
            <Link to={'/supplier-management/suppliers'}>
              <CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
            </Link>
          </div>
          <div className='text-base font-semibold mt-1 text-secondary'>
            {id ? "Edit Supplier" : "Add New Supplier"}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="profilePhoto"
                className="flex h-48 w-48 cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 bg-gray-50 text-gray-500 hover:border-blue-500 hover:text-blue-500"
                style={{
                  backgroundImage: preview ? `url(${preview})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!preview && <span className="text-center">Click to upload Profile</span>}
              </label>
              <input
                type="file"
                id="profilePhoto"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                className="hidden"
              />
              {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
            </div>
            <div className='grid grid-cols-2 gap-6 mt-5'>
              {/* Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Supplier Name <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Contact Person */}
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Contact Person <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Contact Person" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Business Type */}
              <FormField
                control={form.control}
                name="business_type"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Business Type <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Business Type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Address <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <button type="submit" className="bg-secondary rounded-sm p-2 px-6 text-white mt-7">
                {id ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </section >
  )
}
