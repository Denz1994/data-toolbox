import {useQuery} from '@tanstack/react-query';

export const useSalesOrder = () => {
    return useQuery({
        queryKey: ['SalesOrder'],
        queryFn:  async ()=>{
            const result =  await fetch('/data/sales-orders.json');
            if (result.ok){
            return result.json();
           }
           else{
            throw new Error("Failed to fetch data in useSalesOrder.");
           }
        }
    })
}