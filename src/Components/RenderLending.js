import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";

function RenderLending(props) {
    const [OfferData, setOfferData] = useState([]);

    useEffect(() => {
        updateOfferData(props.data)
    // eslint-disable-next-line
    })

    async function updateOfferData(id) {
        let data = await requestOfferData(id);
        setOfferData(data);
    }

    async function requestOfferData(id) {
        let owner;
        let heroId;
        let liquidation;
        let fee;
        let status;
        let collateral;
        let borrower;
        let time;
        try {
            owner = await props.HeroLendingContract.methods.offerOwner(id).call()
        } catch (error) {
            console.error(error);
        }
        try {
            heroId = await props.HeroLendingContract.methods.offerHeroId(id).call()
        } catch (error) {
            console.error(error);
        }
        try {
            liquidation = await props.HeroLendingContract.methods.offerLiquidation(id).call()
        } catch (error) {
            console.error(error);
        }
        try {
            fee = await props.HeroLendingContract.methods.offerDailyFee(id).call()
        } catch (error) {
            console.error(error);
        }
        try {
            status = await props.HeroLendingContract.methods.offerStatus(id).call()
        } catch (error) {
            console.error(error);
        }

        try {
            collateral = await props.HeroLendingContract.methods.offerCollateral(id).call()
        } catch (error) {
            console.error(error);
        }
        try {
            borrower = await props.HeroLendingContract.methods.offerBorrower(id).call()
        } catch (error) {
            console.error(error);
        }
        try {
            time = await props.HeroLendingContract.methods.offerAcceptTime(id).call()
        } catch (error) {
            console.error(error);
        }
        return {
            owner: owner, 
            heroId: heroId, 
            liquidation: liquidation, 
            fee: fee,
            status: status,
            collateral: collateral,
            borrower: borrower,
            time: time}
    }

    function address(address) {
        // eslint-disable-next-line
        if (address != undefined) {
            return address.substring(0,4)+"..."+address.slice(-4)
        }
    }

    function accumulatedFee() {
        if (((Date.now() - parseInt(OfferData.time)*1000)/1000 < 60*60)) {
            return ((OfferData.fee/24)/10**18).toFixed(2)
        } else {
            return (((((Date.now() - (parseInt(OfferData.time)*1000))/1000)/(60*60*24))*OfferData.fee)/10**18).toFixed(2)
        }
    }

    if (OfferData.status == "Open") {
        return (
            <Accordion.Item eventKey={props.data}>
            <Accordion.Header>
            <Container>
                <Row>
                    <Col><Row>Offer Id: {props.data}</Row></Col>
                    <Col><Row>hero Id: {OfferData.heroId}</Row></Col>
                    <Col>Liquidation: {OfferData.liquidation/10**18}</Col>
                    <Col>Daily Fee: {OfferData.fee/10**18}</Col>
                    <Col>Owner: {address(OfferData.owner)}</Col>
                    <Col>Status: {OfferData.status}</Col>
                </Row>
            </Container>
            </Accordion.Header>

            <Accordion.Body>
                <Row><Button variant="success" onClick={() => props.cancelOffer(props.data)}>Cancel</Button></Row>
                <Row style={{height: "10px"}}></Row>
            </Accordion.Body>
            </Accordion.Item>

    )
    } else {
        return (
            <Accordion.Item eventKey={props.data}>
            <Accordion.Header>
            <Container>
                <Row>
                    <Col><Row>Offer Id: {props.data}</Row></Col>
                    <Col><Row>hero Id: {OfferData.heroId}</Row></Col>
                    <Col>Liquidation: {OfferData.liquidation/10**18}</Col>
                    <Col>Daily Fee: {OfferData.fee/10**18}</Col>
                    <Col>Owner: {address(OfferData.owner)}</Col>
                    <Col>Status: {OfferData.status}</Col>
                </Row>
                <Row>
                    <Col><Row>{new Date(parseInt(OfferData.time)*1000).toLocaleTimeString("en-US")}-{new Date(parseInt(OfferData.time)*1000).toLocaleDateString("en-US")}</Row></Col>
                    <Col><Row></Row></Col>
                    <Col>Collateral: {OfferData.collateral/10**18}</Col>
                    <Col>Accumulated Fee: {accumulatedFee()}</Col>
                    <Col>Borrower: {address(OfferData.borrower)}</Col>
                    <Col></Col>
                </Row>
            </Container>
            </Accordion.Header>

            <Accordion.Body>
                <Row><Button variant="success" onClick={() => props.liquidate(props.data)}>Liquidate</Button></Row>
            </Accordion.Body>
            </Accordion.Item>
        )
    }
}

export default RenderLending;