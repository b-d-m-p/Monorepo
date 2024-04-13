import React from 'react'
import styled from 'styled-components'

export const SidebarLogo = () => (
    <Container>
        <SVG viewBox="0 0 1264 236" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill="#FFF6E6"
                d="M842.472 61.809c0-10.13-1.724-16.918-5.172-20.366-3.233-3.663-7.651-5.495-13.254-5.495-5.604 0-10.129 1.724-13.577 5.172-3.233 3.233-4.849 8.944-4.849 17.133v24.245H772V60.516c0-18.319 4.418-32.327 13.254-42.025 9.051-9.913 22.305-14.87 39.762-14.87 17.456 0 30.602 4.957 39.438 14.87 9.051 9.698 13.577 23.706 13.577 42.025 0 12.5-1.939 23.706-5.819 33.62-3.663 9.697-8.297 18.641-13.9 26.83-5.603 8.19-11.638 15.733-18.103 22.629-6.465 6.681-12.284 13.146-17.456 19.396-5.173 6.034-9.267 12.069-12.284 18.103-3.018 6.034-3.987 12.392-2.91 19.073h67.239v32.326H772v-27.801c0-10.991 1.724-20.689 5.172-29.094 3.448-8.405 7.759-16.055 12.931-22.951 5.388-7.112 11.099-13.685 17.133-19.72a208.251 208.251 0 0016.81-19.719c5.388-6.896 9.805-14.44 13.254-22.629 3.448-8.404 5.172-17.995 5.172-28.77zM897.26 60.516c0-18.319 4.634-32.327 13.901-42.025 9.267-9.913 22.628-14.87 40.085-14.87 17.456 0 30.818 4.957 40.085 14.87 9.269 9.698 13.899 23.706 13.899 42.025v117.669c0 18.318-4.63 32.434-13.899 42.347-9.267 9.698-22.629 14.547-40.085 14.547-17.457 0-30.818-4.849-40.085-14.547-9.267-9.913-13.901-24.029-13.901-42.347V60.515zm35.56 119.931c0 8.19 1.616 14.009 4.849 17.457 3.448 3.232 7.973 4.849 13.577 4.849 5.603 0 10.021-1.617 13.254-4.849 3.448-3.448 5.172-9.267 5.172-17.457V58.253c0-8.19-1.724-13.9-5.172-17.133-3.233-3.448-7.651-5.172-13.254-5.172-5.604 0-10.129 1.724-13.577 5.172-3.233 3.233-4.849 8.944-4.849 17.133v122.194zM1098.81 61.809c0-10.13-1.72-16.918-5.17-20.366-3.23-3.663-7.65-5.495-13.25-5.495-5.61 0-10.13 1.724-13.58 5.172-3.23 3.233-4.85 8.944-4.85 17.133v24.245h-33.62V60.516c0-18.319 4.42-32.327 13.25-42.025 9.05-9.913 22.31-14.87 39.77-14.87 17.45 0 30.6 4.957 39.43 14.87 9.05 9.698 13.58 23.706 13.58 42.025 0 12.5-1.94 23.706-5.82 33.62-3.66 9.697-8.3 18.641-13.9 26.83-5.6 8.19-11.64 15.733-18.1 22.629-6.47 6.681-12.29 13.146-17.46 19.396-5.17 6.034-9.26 12.069-12.28 18.103-3.02 6.034-3.99 12.392-2.91 19.073h67.24v32.326h-102.8v-27.801c0-10.991 1.72-20.689 5.17-29.094 3.45-8.405 7.76-16.055 12.93-22.951 5.39-7.112 11.1-13.685 17.14-19.72a210.031 210.031 0 0016.81-19.719c5.38-6.896 9.8-14.44 13.25-22.629 3.45-8.404 5.17-17.995 5.17-28.77zM1208.07 232.069c-17.12 0-30.12-4.756-39-14.268-8.67-9.512-13-23.146-13-40.903v-18.073h32.97v19.659c0 14.585 6.03 21.878 18.08 21.878 5.92 0 10.36-1.797 13.32-5.39 3.17-3.805 4.75-10.358 4.75-19.659V157.24c0-10.146-1.8-17.333-5.39-21.561-3.59-4.439-9.41-6.659-17.44-6.659h-11.73V97.313h12.68c6.98 0 12.16-1.797 15.54-5.39 3.59-3.594 5.39-9.618 5.39-18.073V57.679c0-7.61-1.59-13.212-4.76-16.805s-7.39-5.39-12.68-5.39c-11.2 0-16.8 6.87-16.8 20.61v14.585h-32.98V58.947c0-17.756 4.33-31.39 13-40.902 8.88-9.512 21.56-14.269 38.05-14.269 16.7 0 29.38 4.757 38.05 14.269 8.66 9.3 13 22.829 13 40.585v7.927c0 12.049-2.01 21.772-6.03 29.17-4.01 7.188-10.25 12.367-18.7 15.537v.634c9.09 3.383 15.64 8.878 19.65 16.488 4.02 7.61 6.03 17.334 6.03 29.171v19.659c0 17.756-4.44 31.39-13.32 40.902-8.66 9.301-21.56 13.951-38.68 13.951zM231.015 4l-65.418 228H98.903l24.532-85.5-33.66 19-19.08 66.5H4L69.417 4h66.695L111.58 89.5l33.66-19L164.32 4h66.695zM600.2 4l-33.661 19 5.452-19h-66.695l-33.66 19 5.451-19h-66.694l-65.417 228h66.694l38.16-133 33.661-19-43.612 152h66.694l38.161-133 33.659-19-43.611 152h66.694L666.893 4H600.2zm97.105 161.346L743.599 4h-66.694l-65.418 228h133.389L764 165.346h-66.695zM381.763 70.654L400.887 4H240.52l-19.124 66.654h46.837L221.939 232h66.695l46.293-161.346h46.836z"
            ></path>
        </SVG>
    </Container>
)

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 67px;
`

const SVG = styled.svg`
    width: 60%;
`

export default SidebarLogo
