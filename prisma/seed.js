import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const seed = async () => {
    const concert = await prisma.concert.create({
        data: {
            imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
            name: "Hukum world Tour Nepal",
            date: new Date("2025-12-21T18:00:00"),
            venue: "Thamel, Kathmandu",
            gatesOpenTime: new Date("2025-12-21T16:00:00"),
            about: "From music prdigy to one among south-after comporse in kathmandu, nepal",
            languages: "Neplali, Hindi",
            organizedBy: "Red Bull",
            totalSeats: 10000,
            availableSeats: 10000
        }
    })

    const categories = [
        { name: "fanpit", price: 8500.00, totalSeats: 1000, availableSeats: 1000 },
        { name: "platinum", price: 5000.00, totalSeats: 2000, availableSeats: 2000 },
        { name: "gold", price: 3000.00, totalSeats: 3000, availableSeats: 3000 },
        { name: "silver", price: 1500.00, totalSeats: 4000, availableSeats: 4000 },
    ]

    let toalSeatSum = 0;
    let availableSeatsSum = 0;

    for (const cat of categories) {
        await prisma.ticketCategory.create({
            data: {
                ...cat,
                concertId: concert.id
            }
        })
        toalSeatSum += cat.totalSeats;
        availableSeatsSum += cat.availableSeats;
    }
    await prisma.concert.update({
        where: { id: concert.id },
        data: {
            totalSeats: toalSeatSum,
            availableSeats: availableSeatsSum
        }
    })
    console.log("Seeded concert with category")
}

seed().finally(() => prisma.$disconnect())