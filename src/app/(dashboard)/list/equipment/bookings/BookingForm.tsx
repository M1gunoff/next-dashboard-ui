import FormContainer from "@/components/FormContainer";

type BookingFormProps = {
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
};

const BookingForm = ({ type, data, id }: BookingFormProps) => {
  return (
    <FormContainer 
      table="equipment-booking" 
      type={type} 
      data={data} 
      id={id} 
    />
  );
};

export default BookingForm; 