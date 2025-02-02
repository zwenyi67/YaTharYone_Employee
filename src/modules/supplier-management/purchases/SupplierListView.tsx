import api from "@/api"
import { GetSuppliersType } from "@/api/supplier/types"
import { t } from "i18next"
import { CircleChevronLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const SupplierListView = () => {

    const { data, isFetching } = api.supplier.getSuppliers.useQuery()
    const navigate = useNavigate();

    const clickSup = (sup: GetSuppliersType) => {
        navigate(`/supplier-management/purchasehistories/supplierlist/${sup.id}/create`)
    }

    return (
        <section className="m-4">
            <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
                {t("title.purchasing-transactions")}
            </div>

            <div className="p-6 bg-white rounded-lg">
                <div className='flex mb-8'>
                    <div className='me-5'>
                        <Link to={'/supplier-management/purchasehistories'}>
                            <CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
                        </Link>
                    </div>
                    <div className='text-base font-semibold mt-1 text-secondary'>
                        Supplier List
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                    {isFetching ? (
                        <div className="col-span-4 text-center text-gray-500">Loading...</div>
                    ) : data?.length ? (
                        data.map((sup, index) => (
                            <button onClick={() => clickSup(sup)}
                                key={index}
                                className="p-4 bg-white rounded shadow-md hover:shadow-xl transition duration-200"
                            >
                                <div className="flex justify-center">
                                    {sup.profile === null ? (
                                        <div className="flex">
                                            <div className="flex justify-center items-center rounded-full bg-secondary w-[65px] h-[65px]">
                                                <div className="font-bold text-xl text-white">
                                                    {sup.name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center w-[65px] h-[65px] bg-slate-200 rounded-full">
                                            <img src={`http://127.0.0.1:8000${sup.profile}`} alt={sup.name} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col justify-center items-center gap-1 mt-2">
                                    <div className="font-semibold text-lg text-gray-800">{sup.name}</div>
                                    <p className="text-gray-600">{sup.business_type}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="col-span-4 text-center text-gray-500">
                            No suppliers found.
                        </div>
                    )}
                </div>
            </div>

        </section>
    )
}

export default SupplierListView
