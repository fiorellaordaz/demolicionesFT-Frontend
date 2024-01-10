import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mailSchema } from "../../utils/mailSchema";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import {
  errorNotifications,
  successNotifications,
} from "../../notifications/notifications";

const apiKey = import.meta.env.VITE_REACT_APP_SENDGRID_API_KEY;

export default function MailForm({ ...props }) {
  const { titulo, setOpen } = props;
  const form = useForm({
    resolver: zodResolver(mailSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const onSubmit = async (loginFormData) => {
    const { name, email, phone, mensaje } = loginFormData;

    const requestData = {
      nombre: name,
      email: email,
      phone: phone,
      mensaje: mensaje,
      titulo: titulo,
    };

    if (!apiKey) {
      console.error("SENDGRID_API_KEY not set");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://testapi-49cb.onrender.com/api/send",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      reset();
      successNotifications(data.message);
      setOpen(false);

      return data;
    } catch (error) {
      if (error.response.status === 400) {
        const message = error.response.data.message;
        errorNotifications(message);
      }

      console.log(error);
    }
  };

  return (
    <Box>
      <Typography
        variant="body1"
        color={"primary"}
        borderBottom={2}
        width={"100%"}
        paddingBottom={1}
        mb={2}
      >
        Contacta con Nosotros.
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box display={"flex"} flexDirection={"column"} gap={2}>
          <TextField
            type="text"
            label="Nombre"
            variant="filled"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            type="email"
            label="Email"
            variant="filled"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
          />
          <TextField
            type="number"
            label="Teléfono"
            variant="filled"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          <TextField
            type="text"
            label="¿Qué Necesitas?"
            variant="filled"
            {...register("mensaje")}
          />
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
        </Box>
      </form>
    </Box>
  );
}
