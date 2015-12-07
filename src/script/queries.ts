export const Queries:{[key:string]:string} = {
	"1. Show the title of books with unitprice higher than 50." : `
		SELECT Title 
		FROM Book 
		WHERE UnitPrice > 50 
	`,
 
	"2. Show the name of books belongs to 'category1'." : `
		SELECT Title 
		FROM Book b
			INNER JOIN Subject s ON 
				b.SubjectID = s.SubjectID
		WHERE
			CategoryName = 'category1'
	`,
	
	"3. Show the subject names of books supplied by ‘supplier3’." : `
		SELECT DISTINCT CategoryName
		FROM Book b
			INNER JOIN Supplier s ON 
				s.SupplierID = b.SupplierID
			INNER JOIN Subject s2 ON 
				s2.SubjectID = b.SubjectID
		WHERE
			s.CompanyName = 'supplier3'			
	`,
	
	"4. Show the name and price of the cheapest book supplied by ‘supplier2’." : `
		SELECT Title, b.UnitPrice
		FROM Book b
			INNER JOIN Supplier s ON 
				s.SupplierID = b.SupplierID
				AND s.CompanyName = 'supplier2'
		WHERE b.UnitPrice = (
			SELECT MIN(b2.UnitPrice) 
			FROM Book b2
				INNER JOIN Supplier s2 ON 
					s2.SupplierID = b2.SupplierID
					AND s2.CompanyName = 'supplier2' 
		)
	`,
		
	"5. Show the unique names of all books processed by employee 'lastname5,firstname5'": `
		SELECT DISTINCT b.Title
		FROM Book b
			INNER JOIN Order_Detail od ON 
				od.BookID = b.BookID
			INNER JOIN "Order" o ON
				o.OrderId = o.OrderId
			INNER JOIN Employee e ON 
				e.EmployeeID = o.EmployeeID
		WHERE
			e.FirstName = 'firstname5'
			AND e.LastName = 'lastname5'
		ORDER BY
			b.Title
	`,
	
	"6. Show the title of most expensive books 'lastname4 firstname4' has paid for. (Among all the books 'lastname4 firstname4' has paid for, show the most expensive ones)" : `
		SELECT Title
		FROM Book b
			INNER JOIN Order_Detail od ON od.BookID = b.BookID
			INNER JOIN "Order" o ON o.OrderID = od.OrderID
			INNER JOIN Customer c ON c.CustomerID = o.CustomerID
				AND c.FirstName = 'firstname4' 
				AND c.LastName = 'lastname4'				
		WHERE 
			b.UnitPrice = (
				SELECT MAX(b2.UnitPrice)
				FROM Book b2
					INNER JOIN Order_Detail od2 ON od2.BookID = b2.BookID
					INNER JOIN "Order" o2 ON o2.OrderID = od2.OrderID
						AND o2.CustomerID = c.CustomerID
			)
	`,
	
	"7. Show the names of the customers who have paid more than $70 in totals." : `
		SELECT c.FirstName, c.LastName
		FROM Customer c
			INNER JOIN "Order" o ON o.CustomerID = c.CustomerID
			INNER JOIN Order_Detail od ON od.OrderID = o.OrderID
			INNER JOIN Book b ON b.BookID = od.BookID
		GROUP BY c.FirstName, c.LastName
		HAVING SUM(b.UnitPrice * od.Quantity) > 70
	`,
	
	"*8. Show the cheapest price each customer paid and their book names. List the result in ascending price." : `
		SELECT c.FirstName, c.LastName 
		FROM Customer c
			INNER JOIN "Order" o ON o.CustomerID = c.CustomerID
			INNER JOIN Order_Detail od ON od.OrderID = o.OrderID
			INNER JOIN Book b ON b.BookID = od.BookID
		GROUP BY c.FirstName, c.LastName
	`,
	
	"9. Show the names of all the books shipped on 08/04/2014 and their shippers' names." : `
		SELECT b.Title, sh.ShpperName
		FROM Book b
			INNER JOIN Order_Detail od ON od.BookID = b.BookID
			INNER JOIN "Order" o ON o.OrderID = od.OrderID
			INNER JOIN Shipper sh ON sh.ShipperID = o.ShipperID
		WHERE
			o.ShippedDate = '2014-08-04'
		ORDER BY 
			b.Title ASC
	`,
	
	"10. Show the names of most expensive books employee ’lastname5 firstname5' was responsible for." : `
		SELECT Title
		FROM Book b
			INNER JOIN Order_Detail od ON od.BookID = b.BookID
			INNER JOIN "Order" o ON o.OrderID = od.OrderID
			INNER JOIN Employee e ON e.EmployeeID = o.EmployeeID
				AND e.FirstName = 'firstname5' 
				AND e.LastName = 'lastname5'				
		WHERE 
			b.UnitPrice = (
				SELECT MAX(b2.UnitPrice)
				FROM Book b2
					INNER JOIN Order_Detail od2 ON od2.BookID = b2.BookID
					INNER JOIN "Order" o2 ON o2.OrderID = od2.OrderID
						AND o2.EmployeeID = e.EmployeeID
			)
	`,
	
	"11. Show the unique names of all the books 'lastname3 firstname3' or 'lastname4 firstname4' ordered." : `
		SELECT DISTINCT Title
		FROM Book b
			INNER JOIN Order_Detail od ON od.BookID = b.BookID
			INNER JOIN "Order" o ON o.OrderID = od.OrderID
			INNER JOIN Customer c ON c.CustomerID = o.CustomerID
		WHERE (
			(c.FirstName = 'firstname3' 
				AND c.LastName = 'lastname3')
			OR 
			(c.FirstName = 'firstname4' 
				AND c.LastName = 'lastname4')
		)
	`,
	
	"12. Show the title of books ordered by 'lastname1 firstname1' but not ordered by 'lastname4 firstname4'." : `
		SELECT DISTINCT Title
		FROM Book b
			INNER JOIN Order_Detail od ON od.BookID = b.BookID
			INNER JOIN "Order" o ON o.OrderID = od.OrderID
			INNER JOIN Customer c ON c.CustomerID = o.CustomerID
				AND c.FirstName = 'firstname1' 
				AND c.LastName = 'lastname1'
		
		EXCEPT
		
		SELECT DISTINCT Title
		FROM Book b
			INNER JOIN Order_Detail od ON od.BookID = b.BookID
			INNER JOIN "Order" o ON o.OrderID = od.OrderID
			INNER JOIN Customer c ON c.CustomerID = o.CustomerID
				AND c.FirstName = 'firstname4' 
				AND c.LastName = 'lastname4'
	`,
		
	"13. Show the titles of all the ordered books and their total quantities.  List the result in descending quantity." : `
		SELECT b.Title, SUM(od.Quantity) AS Qty
		FROM Book b
			INNER JOIN Order_Detail od ON od.BookID = b.BookID
		GROUP BY b.Title
		ORDER BY Qty DESC
	`,
	
	"*14. Show the names of the employees who processed at least 8 books." : `
		SELECT e.FirstName, e.LastName
		FROM Employee e
			INNER JOIN "Order" o ON o.EmployeeID = e.EmployeeID
			INNER JOIN Order_Detail od ON od.OrderID = o.OrderID
		GROUP BY e.FirstName, e.LastName
		HAVING SUM(od.Quantity) > 7	
	`,
	
	"15. Show the name of the customers who have ordered at least a book in 'category3' or 'category4' and the book names." : `
		SELECT c.FirstName, c.LastName, b.Title
		FROM Book b
			INNER JOIN Order_Detail od ON od.BookID = b.BookID
			INNER JOIN "Order" o ON o.OrderID = od.OrderID
			INNER JOIN Customer c ON c.CustomerID = o.CustomerID
			INNER JOIN Subject s ON s.SubjectID = b.SubjectID
		WHERE
			s.CategoryName IN ('category3','category4')		
	`,
	
	"16. Show the name of each category and the title of books with most expensive price in that category." : `
		SELECT s.CategoryName, b.Title
		FROM Book b
			INNER JOIN Subject s ON s.SubjectID = b.SubjectID
		WHERE b.UnitPrice = (
			SELECT MAX(b2.UnitPrice)
			FROM Book b2
			WHERE b2.SubjectID = s.SubjectID				
		)
		ORDER BY s.CategoryName
	`,
	
	"17. Show the name and total sale (total price of orders) of each employee." : `
		SELECT e.FirstName, e.LastName, SUM(b.UnitPrice * od.Quantity)
		FROM Employee e
			INNER JOIN "Order" o ON o.EmployeeID = e.EmployeeID
			INNER JOIN Order_Detail od ON o.OrderID = od.OrderID
			INNER JOIN Book b ON od.BookID = b.BookID
		GROUP BY e.FirstName, e.LastName
	`,	
	
	"18. Show the most popular subject(the sale quantity of this subject is the highest)." : `		
		SELECT s.CategoryName
		FROM Order_Detail od
			INNER JOIN Book b ON b.BookID = od.BookID
			INNER JOIN Subject s ON s.SubjectID = b.SubjectID
		GROUP BY b.SubjectId
		HAVING 
			SUM(od.Quantity) = (
				SELECT MAX(qty) 
				FROM (
					SELECT SUM(od2.Quantity) qty
					FROM Order_Detail od2
						INNER JOIN Book b2 ON b2.BookID = od2.BookID
					GROUP BY b2.SubjectID
				) MxQty 
			)
	`,
		
	"*19. Show the names of customers who have ordered more than 3 book and the corresponding quantities. List the result in the descending quantity." : `
		SELECT c.FirstName, c.LastName, SUM(od.Quantity) qty
		FROM Customer c
			INNER JOIN "Order" o ON o.CustomerID = c.CustomerID
			INNER JOIN Order_Detail od ON od.OrderID = o.OrderID
		GROUP BY c.FirstName, c.LastName
		HAVING qty > 3
		ORDER BY qty DESC
	`,
	
	"20. Show the names of customers who ordered all books written by 'author3' or 'author4'.":`
		SELECT DISTINCT c.FirstName, c.LastName
		FROM Customer c
			INNER JOIN 
			(
				(
					SELECT c.CustomerID
					FROM Customer c
					
					EXCEPT
					
					SELECT t3.CustomerID 
					FROM (
						SELECT c.CustomerID as CustomerID, b.BookID
						FROM Customer c, Book b
						WHERE b.Author = 'author3'
									
						EXCEPT 
					
						SELECT c.CustomerID, b.BookID
						FROM Customer c
							INNER JOIN "Order" o ON o.CustomerID = c.CustomerID
							INNER JOIN Order_Detail od ON od.OrderID = o.OrderID
							INNER JOIN Book b ON b.BookId = od.BookID
						WHERE
							b.Author = 'author3'
					) t3
				)	
				UNION
				(
					SELECT c.CustomerID
					FROM Customer c
					
					EXCEPT
					
					SELECT t4.CustomerID 
					FROM (
						SELECT c.CustomerID, b.BookID
						FROM Customer c, Book b
						WHERE b.Author = 'author4'
									
						EXCEPT 
					
						SELECT c.CustomerID, b.BookID
						FROM Customer c
							INNER JOIN "Order" o ON o.CustomerID = c.CustomerID
							INNER JOIN Order_Detail od ON od.OrderID = o.OrderID
							INNER JOIN Book b ON b.BookId = od.BookID
						WHERE
							b.Author = 'author4'
					) t4
				)
			) t34 ON t34.CustomerID = c.CustomerID
		
	`,
	
};