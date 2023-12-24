'use client'

import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from '@chakra-ui/react'
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import React, { ReactNode, useEffect, useState } from 'react'
import { checkLoginLayout } from '../auth/checkLoginLayout'

interface LinkItemProps {
    name: string
    icon: IconType
}

interface NavItemProps extends FlexProps {
    icon: IconType
    children: React.ReactNode
}

interface MobileProps extends FlexProps {
    onOpen: () => void
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}

interface LayoutProps {
    children: ReactNode;
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome },
    { name: 'Trending', icon: FiTrendingUp },
    { name: 'Explore', icon: FiCompass },
    { name: 'Favourites', icon: FiStar },
    { name: 'Settings', icon: FiSettings },
]

const SidebarContent = ({ onClose, officeData, ...rest }: SidebarProps & { officeData: any }) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    {officeData.company}
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    )
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <Box
            as="a"
            href="#"
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Box>
    )
}

const MobileNav = ({ onOpen, userData, officeData, ...rest }: MobileProps & { userData: any } & { officeData: any }) => {
    const handleLogout = async () => {
        localStorage.removeItem('token')
        if (userData.role === 1) {
            window.location.href = '/adminlogin'

        } else {
            window.location.href = '/login'
        }
    };

    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                {officeData.company}
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{userData.rank_s}{userData.firstname} {userData.lastname}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {userData.role === 1 ? 'Super Admin' : userData.role === 2 ? 'Admin' : userData.role === 3 ? 'User' : 'None'}
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuItem>Billing</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    )
}

const SidebarWithHeader: React.FC<LayoutProps> = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [data, setData] = useState([])
    const [offices, setOffices] = useState([]);


    const fetchData = async () => {
        try {
            const result = await checkLoginLayout();
            setData(result);
        } catch (error) {
            console.error('Error fetching login layout:', error);
        }
    };

    const fetchOffices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/office', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setOffices(result.message[0]);
            } else {
                console.log('fetch data rank failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchOffices();
    }, []);

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent onClose={() => onClose} officeData={offices} display={{ base: 'none', md: 'block' }} />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} officeData={offices} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} userData={data} officeData={offices} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {/* Content */}
                {children}
            </Box>
        </Box>
    )
}

export default SidebarWithHeader