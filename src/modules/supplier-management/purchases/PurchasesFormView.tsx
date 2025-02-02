import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Link, useParams } from 'react-router-dom';
import { CircleChevronLeft } from 'lucide-react';
import api from '@/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GetItemCategoriesType } from '@/api/inventory/types';
import { AddPurchaseItemPayloadType, ConfirmPurchaseItemsPayloadType, GetItemType } from '@/api/purchase-item/types';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Cross2Icon } from '@radix-ui/react-icons';
import { t } from "i18next"
import { useDispatch } from 'react-redux';
import { hideLoader, openLoader } from '@/store/features/loaderSlice';


const formSchema = z.object({
  item_category_id: z.string().min(1, {
    message: "Item Category is required.",
  }),
  item_id: z.string().min(1, {
    message: "Item is required.",
  }),
  total_cost: z.union([
    z.string(),
    z.number()
  ])
    .transform((value) => {
      if (typeof value === 'string' && !isNaN(Number(value))) {
        return Number(value);
      }
      return value; // No transformation for already a number
    })
    .refine((value) => {
      return typeof value === 'number' && value >= 0.01;
    }, { message: "Total cost must be greater than 0." }),

  quantity: z.union([
    z.string(),
    z.number()
  ])
    .transform((value) => {
      if (typeof value === 'string' && !isNaN(Number(value))) {
        return Number(value);
      }
      return value;
    })
    .refine((value) => {
      return typeof value === 'number' && value >= 1;
    }, { message: "Quantity must be greater than 0." }),
});

export default function PurchasesFormView() {

  const navigate = useNavigate();

  const { id: supplier_id } = useParams();

  const dispatch = useDispatch();

  const item: AddPurchaseItemPayloadType = {
    item_category_id: "",
    item_id: "",
    item_name: "",
    unit_of_measure: "",
    total_cost: "",
    quantity: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_category_id: item?.item_category_id.toString() || "",
      item_id: item?.item_id.toString() || "",
      total_cost: item?.total_cost || "",
      quantity: item?.quantity || "",
    },
  });

  const { data: cates, isFetching: isCateFetching } = api.inventory.getItemCategories.useQuery();

  const itemCategoryId = useWatch({
    control: form.control,
    name: "item_category_id", // Field to watch
  });

  const unit = useWatch({
    control: form.control,
    name: "item_id"
  })
  const unitOnly = unit ? unit.split(',')[2]?.trim() : '';

  const { data: items, isFetching: isItemFetching } = api.purchaseItem.getItems.useQuery(itemCategoryId);

  const [purchases, SetPurchases] = useState<AddPurchaseItemPayloadType[]>([]);


  const onSubmit = async (item: z.infer<typeof formSchema>) => {
    try {
      const [id, name, unit] = (item.item_id as string).split(',');
      const newPurchaseItem: AddPurchaseItemPayloadType = {
        item_id: id.trim(), // or parseInt(id.trim()) if id is numeric
        item_name: name.trim(),
        unit_of_measure: unit.trim(),
        item_category_id: item.item_category_id,
        total_cost: item.total_cost,
        quantity: item.quantity,
      };
      SetPurchases((prevPurchases: AddPurchaseItemPayloadType[]) => {
        const existingItemIndex = prevPurchases.findIndex((p) => p.item_id === newPurchaseItem.item_id);

        if (existingItemIndex !== -1) {
          // Item exists, show toast
          toast({
            title: "Item already exist in list.",
            variant: "destructive",
          });
          return prevPurchases;
        }

        // Item does not exist, add as a new purchase
        return [...prevPurchases, newPurchaseItem];
      });
      form.reset({
        item_category_id: "",
        item_id: "",
        total_cost: "",
        quantity: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const removeItem = (purchase: AddPurchaseItemPayloadType) => {
    SetPurchases((prevPurchases: AddPurchaseItemPayloadType[]) =>
      prevPurchases.filter((item) => item.item_id !== purchase.item_id)
    );
  };

  useEffect(() => {
    if (itemCategoryId) {
      form.setValue("item_id", ""); // Reset item_id to empty
    }
  }, [itemCategoryId, form]);

  useEffect(() => {
  }, [purchases]);

  const { mutate: confirmPurchases } =
    api.purchaseItem.confirmPurchases.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      }, onSuccess: () => {
        toast({
          title: "New Purchase Transaction added successfully",
          variant: "success",
        });
        navigate("/supplier-management/purchasehistories");
      },
      onError: (error) => {
        //form.setError("name", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        dispatch(hideLoader());
      },
    });

  const confirmPurchase = () => {
    const payload = {
      purchase_items: purchases,
      supplier_id: supplier_id,
      total_amount: 1000,
      purchase_note: "Hello purchase",
    }
    confirmPurchases(payload as ConfirmPurchaseItemsPayloadType);
  }

  const cancelPurchase = () => {
    SetPurchases([]);
  }

  return (
    <section className="m-4">
      <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
        {t("title.purchasing-transactions")}
      </div>
      <div className="p-6 bg-white rounded-lg">
        <div className='flex mb-8'>
          <div className='me-5'>
            <Link to={'/supplier-management/purchasehistories/supplierlist'}>
              <CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
            </Link>
          </div>
          <div className='text-base font-semibold mt-1 text-secondary'>
            Purchsing Item List
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-7 gap-6 mt-5'>
              {/*Item Category */}
              <div className='col-span-2'>
                <FormField
                  control={form.control}
                  name="item_category_id"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Item Category <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isCateFetching ? 'Loading' : 'Select Category'} />
                          </SelectTrigger>
                          <SelectContent>
                            {cates?.map((cate: GetItemCategoriesType) => (
                              <SelectItem key={cate.id} value={cate.id.toString()}>{cate.name}</SelectItem>
                            ))}

                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Item Name */}
              <div className='col-span-2'>
                <FormField
                  control={form.control}
                  name="item_id"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Item Name <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Select disabled={!itemCategoryId} value={field.value}
                          onValueChange={(value) => field.onChange(value)} defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isItemFetching ? 'Loading' : 'Select Item'} />
                          </SelectTrigger>
                          <SelectContent>
                            {items?.map((item: GetItemType) => (
                              <SelectItem key={item.id} value={`${item.id.toString()},${item.name},${item.unit_of_measure}`}>{item.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Unit of Measure */}
              <div>
                <div className="">
                  <FormLabel>Unit</FormLabel>
                  <Input disabled placeholder={unitOnly} />
                </div>
              </div>
              {/* Quantity */}
              <div>
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Quantity <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0' {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Total Cost */}
              <div>
                <FormField
                  control={form.control}
                  name="total_cost"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Total Cost <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0' {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <button type="submit" className="bg-secondary rounded-sm p-2 px-6 text-white mt-5">
                Submit
              </button>
            </div>
          </form>
        </Form>

        <div className='flex justify-center mt-10 p-5'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead >
                </TableHead>
                <TableHead >No</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length > 0 ? (
                purchases.map((purchase, index) => (
                    <TableRow key={purchase.item_id}>
                      <TableCell><button onClick={() => removeItem(purchase)} className='bg-primary hover:bg-red-500 rounded-full p-1 text-white'><Cross2Icon className='h-3 w-3' /></button></TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{purchase.item_name}</TableCell>
                      <TableCell>{purchase.quantity} {purchase.unit_of_measure}</TableCell>
                      <TableCell>${purchase.total_cost}</TableCell>
                    </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}

              {purchases.length > 0 && (
                <>
                  <TableRow>
                    <TableCell colSpan={4}>Total Amount</TableCell>
                    <TableCell>
                      ${purchases.reduce((total, purchase) => total + (purchase.total_cost), 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <button onClick={cancelPurchase} className='bg-primary hover:bg-red-500 text-white p-2 px-4 rounded-sm'>Cancel</button>
                    </TableCell>
                    <TableCell>
                      <button onClick={confirmPurchase} className='bg-secondary hover:bg-blue-500 text-white p-2 px-4 rounded-sm'>Confirm</button>
                    </TableCell>
                  </TableRow>
                </>
              )}

            </TableBody>
          </Table>

        </div>
      </div>
    </section >
  )
}
