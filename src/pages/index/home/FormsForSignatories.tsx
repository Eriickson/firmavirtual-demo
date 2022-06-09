import React, { Fragment, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  List,
  ListItem,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useIndexContext } from "./.context";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

export const FormsForSignatories = () => {
  const { register, setValue, reset } = useForm();

  const { contractOwner, contractDetail, getContract } = useIndexContext();
  const [isFocusInput, setIsFocusInput] = useState<{ name: string; value: boolean }>({ name: "", value: false });

  const debounced = useDebouncedCallback(({ name, stringValue, value }) => {
    console.log({ name, stringValue, value });
  }, 500);

  const [fields] = useState([
    { id: 1, name: "full_name", placeholder: "sdadsdas", label: "Nombre Completo" },
    { id: 2, name: "email", placeholder: "sdadsdas", label: "Correo electrónico" },
    { id: 3, name: "RUT", placeholder: "sdadsdas", label: "RUT (Sin puntos y con guión)" },
    { id: 4, name: "phone", placeholder: "sdadsdas", label: "Número de celular" },
  ]);

  return (
    <Box mx="auto" maxW="6xl" px="20">
      <Stack>
        <FormControl>
          <FormLabel>Firma</FormLabel>
          <Select
            onChange={(e: any) => {
              getContract(e.target.value);
              fields.forEach((field) => {
                setValue(field.name, "");
              });
            }}
          >
            {contractOwner.map((contract) => (
              <option key={contract.sContractID} value={contract.sContractID}>
                {contract.sTipoContrato}
              </option>
            ))}
          </Select>
        </FormControl>
        {fields.map((field) => {
          return (
            <FormControl position="relative" key={field.id}>
              <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
              <Input
                id={field.name}
                type={field.name}
                {...register(field.name, { required: true })}
                placeholder={field.placeholder}
                onFocus={() => setIsFocusInput({ name: field.name, value: true })}
                onBlur={() => {
                  setTimeout(() => {
                    setIsFocusInput({ name: field.name, value: false });
                  }, 200);
                }}
                onChange={(e: any) => debounced({ ...isFocusInput, stringValue: e.target.value })}
              />
              {isFocusInput?.name === field.name && isFocusInput.value && (
                <Box pos="absolute" top="20" w="full" zIndex="1">
                  <Box w="full" bgColor="white" borderWidth="1px" rounded="sm" shadow="sm">
                    <List>
                      {contractDetail?.firmantes.map((firmante, i) => (
                        <Fragment key={i}>
                          <ListItem
                            cursor="pointer"
                            _hover={{ bgColor: "gray.200" }}
                            px="4"
                            py="1.5"
                            onClick={() => {
                              console.log("Complete info with", firmante);
                              reset(firmante);
                            }}
                          >
                            {firmante[field.name as keyof typeof firmante]}
                          </ListItem>
                          <Divider />
                        </Fragment>
                      ))}
                    </List>
                  </Box>
                </Box>
              )}
            </FormControl>
          );
        })}
        <Checkbox>Este firmante realizará el pago del 50% o 100% del trámite</Checkbox>
        <HStack justifyContent="space-between">
          <Text mr="10" fontSize="sm">
            Seleeciona almenos 1 de los firmates como responsable del pago. Puedes dividir el pago hasta 2 firmantes.
          </Text>
          <Button rounded="sm" minW="max-content" colorScheme="blue">
            Seleccionar quienes serán responsables del pago
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};
