import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CircleChevronLeft } from 'lucide-react';
import api from '@/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GetItemCategoriesType } from '@/api/inventory/types';
import { AddPurchaseItemPayloadType, GetItemType } from '@/api/purchase-item/types';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Cross2Icon } from '@radix-ui/react-icons';
import { t } from "i18next"
import { useDispatch } from 'react-redux';
import { hideLoader, openLoader } from '@/store/features/loaderSlice';
import { AddonItemPayloadType, AddonItems } from '@/api/menu/types';


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

export default function AddonFormView() {

  const navigate = useNavigate();

  const { id: menu_id } = useParams();

  const location = useLocation();
  const addonsData = location.state?.data.addon_items;

  const [addons, setAddons] = useState<AddonItems[]>([]);

  useEffect(() => {
    setAddons(addonsData);
  }, [addonsData]);

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

  const onSubmit = async (item: z.infer<typeof formSchema>) => {
    try {
      const [id, name, unit] = (item.item_id as string).split(',');
      const newAddonItem: AddonItems = {
        id: Number(id.trim()),
        name: name.trim(),
        unit_of_measure: unit.trim(),
        additional_price: item.total_cost,
        quantity: item.quantity,
      };
      setAddons((prevAddons: AddonItems[]) => {
        const existingItemIndex = prevAddons.findIndex((p) => p.id === newAddonItem.id);

        if (existingItemIndex !== -1) {
          // Item exists, show toast
          toast({
            title: "Item already exist in list.",
            variant: "destructive",
          });
          return prevAddons;
        }

        return [...prevAddons, newAddonItem];
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

  const removeItem = (addon: AddonItems) => {
    setAddons((prevAddons: AddonItems[]) =>
      prevAddons.filter((item) => item.id !== addon.id)
    );
  };

  useEffect(() => {
    if (itemCategoryId) {
      form.setValue("item_id", ""); // Reset item_id to empty
    }
  }, [itemCategoryId, form]);

  const { mutate: addonItem } =
    api.menu.addonItem.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      }, onSuccess: () => {
        toast({
          title: "Add on Items Updated successfully",
          variant: "success",
        });
        navigate("/menu-management/menus");
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
      menu_id: menu_id,
      addon_items: addons,
      createby: 1,
    }
    addonItem(payload as AddonItemPayloadType);
  }



  return (
    <section className="m-4">
      <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
        {t("title.menu-management")}
      </div>
      <div className="p-6 bg-white rounded-lg">
        <div className='flex mb-8'>
          <div className='me-5'>
            <Link to={'/menu-management/menus'}>
              <CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
            </Link>
          </div>
          <div className='text-base font-semibold mt-1 text-secondary'>
            Menu Addon Item List
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
                      <FormLabel>Additional Price <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
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
                Add
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
                <TableHead>Additional Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addons.length > 0 ? (
                <>
                  {addons.map((item: AddonItems, index: number) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <button onClick={() => removeItem(item)} className='bg-primary hover:bg-red-500 rounded-full p-1 text-white'>
                          <Cross2Icon className='h-3 w-3' />
                        </button>
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity} {item.unit_of_measure}</TableCell>
                      <TableCell>${item.additional_price}</TableCell>
                    </TableRow>
                  ))}

                  {/* ✅ Wrap these rows inside the same fragment */}
                  <TableRow>
                    <TableCell>
                      <button onClick={confirmPurchase} className='bg-secondary hover:bg-blue-500 text-white p-2 px-4 rounded-sm'>Confirm</button>
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}


            </TableBody>
          </Table>

        </div>
      </div>
    </section >
  )
}
