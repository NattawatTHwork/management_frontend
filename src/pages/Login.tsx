'use client'

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'
import { useEffect, useState, FormEvent } from 'react'
import { checkLogin } from '../components/auth/checkLogin';
import Swal from 'sweetalert2';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        code_verify: '',
    });

    useEffect(() => {
        checkLogin();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.status === 'success') {
                localStorage.setItem('token', result.token);
                if (result.message === 2) {
                    window.location.href = '/admin'
                } else if (result.message === 3) {
                    window.location.href = '/'
                }
            } else if (result.status == 'nofound') {
                await Swal.fire({
                    icon: 'error',
                    title: result.message,
                    text: 'This account does not exist in the system.',
                });
            } else if (result.status == 'disable') {
                await Swal.fire({
                    icon: 'error',
                    title: result.message,
                    text: 'This account disable.',
                });
            } else if (result.status == 'norights') {
                await Swal.fire({
                    icon: 'error',
                    title: result.message,
                    text: 'This account no rights.',
                });
            } else if (result.status == 'noverify') {
                await Swal.fire({
                    icon: 'error',
                    title: result.message,
                    text: 'This code verify is incorrect.',
                });
            } else if (result.status == 'failed') {
                await Swal.fire({
                    icon: 'error',
                    title: result.message,
                    text: 'This password is incorrect.',
                });
            } else {
                alert('Login Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    {/* <Text fontSize={'lg'} color={'gray.600'}>
                        to enjoy all of our cool <Text color={'blue.400'}>features</Text> ✌️
                    </Text> */}
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" name='email' value={formData.email} onChange={handleInputChange} />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" name='password' value={formData.password} onChange={handleInputChange} />
                        </FormControl>
                        <FormControl id="code_verify">
                            <FormLabel>Code Verify</FormLabel>
                            <Input type="text" name='code_verify' value={formData.code_verify} onChange={handleInputChange} />
                        </FormControl>

                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Checkbox>Remember me</Checkbox>
                                <Text color={'blue.400'}>Forgot password?</Text>
                            </Stack>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleSubmit}>
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}